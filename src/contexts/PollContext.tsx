import useAppConstants from '@/hooks/useAppConstants';
import useEthersSigner from '@/hooks/useEthersSigner';
import usePoll from '@/hooks/usePoll';
import usePollArtifacts from '@/hooks/usePollArtifacts';
import usePrivoteContract from '@/hooks/usePrivoteContract';
import { PollStatus } from '@/types';
import { DEFAULT_IVCP_DATA, DEFAULT_SG_DATA } from '@/utils/constants';
import { handleNotice, notification } from '@/utils/notification';
import { computePollStatus, notifyStatusChange, shouldNotifyStatusChange } from '@/utils/pollStatus';
import { getJoinedUserData, getKeys } from '@/utils/subgraph';
import { generateSignUpTreeFromKeys, isTallied, joinPoll } from '@maci-protocol/sdk/browser';
import { type LeanIMTMerkleProof } from '@zk-kit/lean-imt';
import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Hex, parseAbi } from 'viem';
import { usePublicClient } from 'wagmi';
import { useSigContext } from './SigContext';
import { type IPollContextType } from './types';

export const PollContext = createContext<IPollContextType | undefined>(undefined);

export const PollProvider = ({ pollAddress, children }: { pollAddress: string; children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  // MACI contract
  const [inclusionProof, setInclusionProof] = useState<LeanIMTMerkleProof | null>(null);

  // Poll contract
  const [hasJoinedPoll, setHasJoinedPoll] = useState<boolean>(false);
  const [initialVoiceCredits, setInitialVoiceCredits] = useState<number>(0);
  const [pollStateIndex, setPollStateIndex] = useState<string | undefined>(undefined);

  // Dynamic poll status and loading states
  const [dynamicPollStatus, setDynamicPollStatus] = useState<PollStatus | null>(null);
  const [isCheckingTallied, setIsCheckingTallied] = useState<boolean>(false);
  const [isCheckingUserJoinedPoll, setIsCheckingUserJoinedPoll] = useState<boolean>(false);

  // Artifacts from custom hook (lazy loading - only load when user hasn't joined the poll)
  const { artifacts, error: artifactsError, loadArtifacts } = usePollArtifacts(!hasJoinedPoll);

  // Wallet variables
  const signer = useEthersSigner();
  const client = usePublicClient();

  // Poll
  const {
    data: poll,
    isLoading: pollLoading,
    isError: isPollError,
    error: pollError,
    refetch: refetchPoll
  } = usePoll({ pollAddress });

  const { subgraphUrl } = useAppConstants();
  const { maciKeypair, isRegistered, stateIndex } = useSigContext();
  const privoteContract = usePrivoteContract();

  // Compute dynamic poll status based on current time
  const computeDynamicPollStatus = useCallback(() => {
    if (!poll) return null;
    return computePollStatus(poll.startDate, poll.endDate);
  }, [poll]);

  // Update dynamic status periodically and notify on changes
  useEffect(() => {
    if (!poll) return;

    const updateStatus = (interval?: NodeJS.Timeout) => {
      const newStatus = computeDynamicPollStatus();
      const previousStatus = dynamicPollStatus;

      setDynamicPollStatus(newStatus);

      // Show notification if status changed
      if (shouldNotifyStatusChange(previousStatus, newStatus) && previousStatus && newStatus) {
        notifyStatusChange(previousStatus, newStatus);
      }

      // Clear interval if poll is over
      if (newStatus === PollStatus.CLOSED) {
        clearInterval(interval);
      }
    };

    // Update immediately
    updateStatus();

    // Set up interval to update every second
    const interval = setInterval(() => {
      updateStatus(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [poll, computeDynamicPollStatus, dynamicPollStatus]);

  // Functions
  const getInclusionProof = useCallback(async () => {
    if (!stateIndex) {
      return;
    }
    if (!maciKeypair) {
      return;
    }
    try {
      const keys = await getKeys(subgraphUrl);
      const signupTree = generateSignUpTreeFromKeys(keys);

      // Find the leaf's index directly from the tree to compare
      const treeIndex = signupTree.indexOf(maciKeypair.publicKey.hash());
      const inclusionProof = treeIndex !== -1 ? signupTree.generateProof(treeIndex) : null;
      setInclusionProof(inclusionProof);

      return inclusionProof;
    } catch (error) {
      console.error('Error getting inclusion proof', error);
    }
  }, [maciKeypair, stateIndex, subgraphUrl]);

  const onJoinPoll = useCallback(
    async (signupData: string = DEFAULT_SG_DATA) => {
      setError(undefined);
      setIsLoading(true);

      if (!signer) {
        setError('Signer not found');
        setIsLoading(false);

        notification.error('Signer not found');
        return;
      }
      if (!maciKeypair) {
        setError('Keypair not found');
        setIsLoading(false);

        notification.error('Keypair not found');
        return;
      }
      if (!isRegistered) {
        setError('User not registered');
        setIsLoading(false);

        notification.error('User not registered');
        return;
      }
      if (!stateIndex) {
        setError('State index not found');
        setIsLoading(false);

        notification.error('State index not found! Register with privote first');
        return;
      }
      if (!privoteContract) {
        setError('Privote contract not found');
        setIsLoading(false);

        notification.error('Privote contract not found! Connect to a supported chain');
        return;
      }

      if (!poll || !poll.pollId) {
        setIsLoading(false);

        notification.error('Poll not found');
        return;
      }

      if (hasJoinedPoll) {
        setError('Already joined poll');
        setIsLoading(false);

        notification.error('Already joined poll');
        return;
      }

      let notificationId = notification.loading('Loading Artifacts...');

      const artifactsInternal = artifacts ?? (await loadArtifacts());

      if (!artifactsInternal) {
        const errorMsg = artifactsError || 'Failed to load artifacts';
        setError(errorMsg);
        setIsLoading(false);
        handleNotice({
          message: errorMsg,
          type: 'error',
          id: notificationId
        });
        return;
      }

      notificationId = handleNotice({
        message: 'Joining poll...',
        type: 'loading',
        id: notificationId
      });

      const inclusionProofDirect = inclusionProof ?? (await getInclusionProof());

      let errorMessage: string = '';
      const joinedPoll = await joinPoll({
        maciAddress: privoteContract.address,
        privateKey: maciKeypair.privateKey.serialize(),
        signer,
        pollId: BigInt(poll.pollId),
        inclusionProof: inclusionProofDirect ?? undefined,
        pollJoiningZkey: artifactsInternal.zKey as unknown as string,
        pollWasm: artifactsInternal.wasm as unknown as string,
        sgDataArg: signupData,
        ivcpDataArg: DEFAULT_IVCP_DATA,
        blocksPerBatch: 1000000,
        useLatestStateIndex: true
      }).catch(error => {
        if (error.message.includes('0xa3281672')) {
          // 0xa3281672 -> signature of BalanceTooLow()
          errorMessage = 'Address balance is too low to join the poll';
          setError(`Address balance is too low to join the poll`);
          setIsLoading(false);
          return;
        }
        console.log('Error joining poll', error);
        errorMessage = 'Error joining poll';
        setError(errorMessage);
        return;
      });

      if (!joinedPoll) {
        setIsLoading(false);
        handleNotice({
          message: errorMessage || 'Failed to join the poll',
          type: 'error',
          id: notificationId
        });
        return;
      }

      setHasJoinedPoll(true);
      setInitialVoiceCredits(Number(joinedPoll.voiceCredits));
      setPollStateIndex(joinedPoll.pollStateIndex);

      setIsLoading(false);
      handleNotice({
        message: 'Joined the poll',
        type: 'success',
        id: notificationId
      });
    },
    [
      artifacts,
      hasJoinedPoll,
      inclusionProof,
      isRegistered,
      maciKeypair,
      signer,
      stateIndex,
      poll,
      getInclusionProof,
      privoteContract,
      loadArtifacts,
      artifactsError
    ]
  );

  const checkIsTallied = useCallback(async () => {
    if (!privoteContract || !signer || !poll) {
      return false;
    }

    setIsCheckingTallied(true);
    try {
      const isPollTallied = await isTallied({
        maciAddress: privoteContract.address,
        pollId: poll.pollId.toString(),
        signer
      });
      return isPollTallied;
    } finally {
      setIsCheckingTallied(false);
    }
  }, [privoteContract, signer, poll]);

  const checkMergeStatus = useCallback(async () => {
    if (!client) return false;

    try {
      const hasMerged = await client.readContract({
        address: pollAddress as Hex,
        abi: parseAbi(['function stateMerged() view returns (bool)']),
        functionName: 'stateMerged'
      });
      return hasMerged;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [client, pollAddress]);

  // // generate maci state tree locally
  useEffect(() => {
    (async () => {
      if (!signer) {
        setInclusionProof(null);
        return;
      }

      if (!maciKeypair) {
        setInclusionProof(null);
        return;
      }

      if (!isRegistered) {
        setInclusionProof(null);
        return;
      }

      try {
        const localInclusionProof = await getInclusionProof();

        setInclusionProof(localInclusionProof ?? null);
      } catch (error) {
        console.log(error);
        setError('Error generating MACI state tree');
        setInclusionProof(null);
      }
    })();
  }, [isRegistered, maciKeypair, pollAddress, signer, stateIndex, getInclusionProof]);

  // check poll user data
  useEffect(() => {
    (async () => {
      setIsCheckingUserJoinedPoll(true);
      setHasJoinedPoll(false);
      setInitialVoiceCredits(0);
      setPollStateIndex(undefined);

      if (!signer) {
        setIsCheckingUserJoinedPoll(false);
        return;
      }

      if (!maciKeypair) {
        setIsCheckingUserJoinedPoll(false);
        return;
      }

      if (!isRegistered) {
        setIsCheckingUserJoinedPoll(false);
        return;
      }

      // if it is the first poll then !pollAddress = false because !0n = false
      if (!pollAddress) {
        setIsCheckingUserJoinedPoll(false);
        return;
      }

      try {
        const { isJoined, voiceCredits, pollStateIndex } = await getJoinedUserData(
          subgraphUrl,
          pollAddress,
          maciKeypair
        );

        setHasJoinedPoll(isJoined);
        setInitialVoiceCredits(Number(voiceCredits));
        setPollStateIndex(pollStateIndex);
      } catch (error) {
        console.log(error);
        setError('Error checking if user has joined poll');
      } finally {
        setIsCheckingUserJoinedPoll(false);
      }
    })();
  }, [isRegistered, maciKeypair, pollAddress, signer, stateIndex, subgraphUrl]);

  const value = useMemo<IPollContextType>(
    () => ({
      isJoiningPoll: isLoading,
      error: error,
      poll: poll ? { ...poll, status: dynamicPollStatus || poll.status } : poll,
      pollLoading,
      isPollError,
      pollError,
      hasJoinedPoll,
      initialVoiceCredits,
      pollStateIndex,
      stateIndex,
      onJoinPoll,
      refetchPoll,
      checkMergeStatus,
      checkIsTallied,
      dynamicPollStatus,
      isCheckingTallied,
      isCheckingUserJoinedPoll
    }),
    [
      isLoading,
      error,
      poll,
      dynamicPollStatus,
      pollLoading,
      isPollError,
      pollError,
      hasJoinedPoll,
      initialVoiceCredits,
      pollStateIndex,
      stateIndex,
      onJoinPoll,
      refetchPoll,
      checkMergeStatus,
      checkIsTallied,
      isCheckingTallied,
      isCheckingUserJoinedPoll
    ]
  );

  return <PollContext.Provider value={value as IPollContextType}>{children}</PollContext.Provider>;
};
