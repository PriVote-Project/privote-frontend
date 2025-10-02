import useAppConstants from '@/hooks/useAppConstants';
import useEthersSigner from '@/hooks/useEthersSigner';
import usePoll from '@/hooks/usePoll';
import usePollArtifacts from '@/hooks/usePollArtifacts';
import usePrivoteContract from '@/hooks/usePrivoteContract';
import { PollStatus } from '@/types';
import { DEFAULT_IVCP_DATA, DEFAULT_SG_DATA, SIGNATURE_MESSAGE, PORTO_CONNECTOR_ID } from '@/utils/constants';
import { handleNotice, notification } from '@/utils/notification';
import { computePollStatus, notifyStatusChange, shouldNotifyStatusChange } from '@/utils/pollStatus';
import { getJoinedUserData, getKeys, getSignedupUserData } from '@/utils/subgraph';
import { Keypair } from '@maci-protocol/domainobjs';
import { generateSignUpTreeFromKeys, isTallied, joinPoll, signup } from '@maci-protocol/sdk/browser';
import { type LeanIMTMerkleProof } from '@zk-kit/lean-imt';
import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Hex, parseAbi, keccak256 } from 'viem';
import { usePublicClient, useAccount, useSignMessage } from 'wagmi';
import { type IPollContextType } from './types';
import useFaucetContext from '@/hooks/useFaucetContext';
import { useSigContext } from './SigContext';
import { generateKeypairFromSeed } from '@/utils/keypair';

export const PollContext = createContext<IPollContextType | undefined>(undefined);

export const PollProvider = ({ pollAddress, children }: { pollAddress: string; children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignupLoading, setIsSignupLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  // MACI contract
  const [inclusionProof, setInclusionProof] = useState<LeanIMTMerkleProof | null>(null);

  // variables for porto
  const [portoMaciKeypair, setPortoMaciKeypair] = useState<Keypair | null>(null);
  const [portoMaciStateIndex, setPortoMaciStateIndex] = useState<string | undefined>(undefined);
  const [portoIsRegistered, setPortoIsRegistered] = useState<boolean>(false);

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
  const { signMessageAsync } = useSignMessage();
  const signer = useEthersSigner();
  const client = usePublicClient();
  const { address, isConnected, connector } = useAccount();

  // Poll
  const {
    data: poll,
    isLoading: pollLoading,
    isError: isPollError,
    error: pollError,
    refetch: refetchPoll
  } = usePoll({ pollAddress });

  const { subgraphUrl } = useAppConstants();
  const privoteContract = usePrivoteContract();
  const { maciKeypair, isRegistered, stateIndex, loadKeypairFromLocalStorage, generateKeypair, updateStatus } =
    useSigContext();
  const { checkBalance } = useFaucetContext();
  const isPorto = connector?.id === PORTO_CONNECTOR_ID;

  // temp variables
  const unifiedState = useMemo(() => {
    if (isPorto) {
      return {
        maciKeypair: portoMaciKeypair,
        isRegistered: portoIsRegistered,
        stateIndex: portoMaciStateIndex
      };
    }

    return {
      maciKeypair,
      isRegistered,
      stateIndex
    };
  }, [isPorto, portoMaciKeypair, portoIsRegistered, portoMaciStateIndex, maciKeypair, isRegistered, stateIndex]);
  const tempMaciKeypair = unifiedState.maciKeypair;
  const tempStateIndex = unifiedState.stateIndex;
  const tempIsRegistered = unifiedState.isRegistered;

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
    if (!tempStateIndex) {
      return;
    }
    if (!tempMaciKeypair) {
      return;
    }
    try {
      const keys = await getKeys(subgraphUrl);
      const signupTree = generateSignUpTreeFromKeys(keys);

      // Find the leaf's index directly from the tree to compare
      const treeIndex = signupTree.indexOf(tempMaciKeypair.publicKey.hash());
      const inclusionProof = treeIndex !== -1 ? signupTree.generateProof(treeIndex) : null;
      setInclusionProof(inclusionProof);

      return inclusionProof;
    } catch (error) {
      console.error('Error getting inclusion proof', error);
    }
  }, [tempMaciKeypair, tempStateIndex, subgraphUrl]);

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
      if (!tempMaciKeypair) {
        setError('Keypair not found');
        setIsLoading(false);

        notification.error('Keypair not found');
        return;
      }
      if (!tempIsRegistered) {
        setError('User not registered');
        setIsLoading(false);

        notification.error('User not registered');
        return;
      }
      if (!tempStateIndex) {
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

      if (checkBalance()) {
        setIsLoading(false);
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
        privateKey: tempMaciKeypair.privateKey.serialize(),
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
      tempIsRegistered,
      tempMaciKeypair,
      signer,
      tempStateIndex,
      poll,
      getInclusionProof,
      privoteContract,
      loadArtifacts,
      artifactsError,
      checkBalance
    ]
  );

  const onSignup = useCallback(async () => {
    setError(undefined);
    setIsSignupLoading(true);

    if (!isConnected) {
      setError('Wallet not connected');
      setIsSignupLoading(false);

      notification.error('Wallet not connected');
      return;
    }

    if (tempIsRegistered) {
      setError('Already registered');
      setIsSignupLoading(false);

      notification.error('Already registered');
      return;
    }

    if (!privoteContract) {
      setError('Privote contract not found');
      setIsSignupLoading(false);

      notification.error('Privote contract not found! Connect to a supported chain');
      return;
    }

    if (!signer) {
      setError('Signer not found');
      setIsSignupLoading(false);

      notification.error('Signer not found');
      return;
    }

    if (isPorto && !poll) {
      setError('Poll not found');
      setIsSignupLoading(false);

      notification.error('Poll not found! Please refresh the page');
      return;
    }

    if (checkBalance()) {
      setIsSignupLoading(false);
      return;
    }

    let keypair = tempMaciKeypair;
    if (!keypair) {
      try {
        keypair = isPorto
          ? ((await generateKeypairForPorto(pollAddress, poll?.endDate)) as Keypair)
          : ((await generateKeypair()) as Keypair);
      } catch (error) {
        setError('Error creating keypair');
        setIsSignupLoading(false);

        notification.error('Error creating keypair');
        console.log('Error creating keypair:', error);
        return;
      }
    }

    let notificationId = notification.loading('Checking if user is registered...');

    let isUserRegistered = false;
    try {
      const { isRegistered: _isRegistered, stateIndex: _stateIndex } = await getSignedupUserData(subgraphUrl, keypair);

      isUserRegistered = _isRegistered;
      if (isPorto) {
        updatePortoStatus(_isRegistered, _stateIndex);
      } else {
        updateStatus(_isRegistered, _stateIndex);
      }
    } catch (error) {
      setError('Error checking if user is registered');
      setIsSignupLoading(false);

      handleNotice({
        message: 'Error checking if user is registered',
        type: 'error',
        id: notificationId
      });
      console.log('Error checking if user is registered:', error);
      return;
    }

    if (isUserRegistered) {
      setIsSignupLoading(false);
      handleNotice({
        message: "You're already signed up to MACI contract",
        type: 'success',
        id: notificationId
      });
      return;
    }

    notificationId = handleNotice({
      message: 'Signing up...',
      type: 'loading',
      id: notificationId
    });
    try {
      const { stateIndex: _stateIndex } = await signup({
        maciAddress: privoteContract.address,
        maciPublicKey: keypair.publicKey.serialize() as string,
        sgData: DEFAULT_SG_DATA,
        signer
      });
      if (isPorto) {
        updatePortoStatus(true, _stateIndex);
      } else {
        updateStatus(true, _stateIndex);
      }
      setIsSignupLoading(false);
      notificationId = handleNotice({
        message: 'Signed up to PRIVOTE contract',
        type: 'success',
        id: notificationId
      });
    } catch (error) {
      console.log('Signup error', error);
      setError('Error signing up');
      setIsSignupLoading(false);
      handleNotice({
        message: 'Error signing up',
        type: 'error',
        id: notificationId
      });
    }
  }, [isConnected, tempIsRegistered, tempMaciKeypair, poll, signer, privoteContract, generateKeypair, subgraphUrl]);

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

  const savePortoKeypairToLocalStorage = useCallback(
    (keypair: Keypair, address: Hex, pollAddress: string, pollEndDate: string) => {
      if (!address) return;

      const storedKey = `maciKeypair-poll-${pollAddress}-${address}`;
      try {
        const privateKeyHex = keypair.privateKey.serialize();
        const value = {
          privateKey: privateKeyHex,
          timestamp: Number(pollEndDate) * 1000
        };
        window.localStorage.setItem(storedKey, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving keypair to localStorage:', error);
      }
    },
    []
  );

  const generateKeypairForPorto = useCallback(
    async (pollAddress?: string, pollEndDate?: string) => {
      if (!address || !pollAddress || !pollEndDate) {
        console.log('Missing pollAddress or pollEndDate- ByPassing...');
        return;
      }

      if (!isPorto) {
        notification.error('Porto not enabled');
        return;
      }

      try {
        const storageKey = `maciKeypair-poll-${pollAddress}-${address}`;
        const pastKeypair = loadKeypairFromLocalStorage(storageKey);

        if (pastKeypair) {
          setPortoMaciKeypair(pastKeypair);
          return pastKeypair;
        }

        const signature = await signMessageAsync({ message: SIGNATURE_MESSAGE });
        const signatureSeed = keccak256(signature);

        const valid = await client?.verifyMessage({
          address: address,
          message: SIGNATURE_MESSAGE,
          signature
        });

        if (!valid) {
          throw new Error("Couldn't validate signature!");
        }
        const keypair = generateKeypairFromSeed(signatureSeed);
        savePortoKeypairToLocalStorage(keypair, address, pollAddress, pollEndDate);
        setPortoMaciKeypair(keypair);

        return keypair;
      } catch (err) {
        console.log(err);
      }
    },
    [
      address,
      isPorto,
      loadKeypairFromLocalStorage,
      signMessageAsync,
      client,
      savePortoKeypairToLocalStorage,
      setPortoMaciKeypair
    ]
  );

  const updatePortoStatus = useCallback((isRegistered: boolean, stateIndex: string | undefined) => {
    setPortoIsRegistered(isRegistered);
    setPortoMaciStateIndex(stateIndex);
  }, []);

  useEffect(() => {
    if (!address || !isPorto || !poll) {
      setPortoMaciKeypair(null);
      return;
    }

    // Try to load existing keypair from localStorage
    const storageKey = `maciKeypair-poll-${pollAddress}-${address}`;
    const existingKeypair = loadKeypairFromLocalStorage(storageKey);
    if (existingKeypair) {
      setPortoMaciKeypair(existingKeypair);
    } else {
      setPortoMaciKeypair(null);
    }
  }, [address, isPorto, pollAddress, poll]);

  useEffect(() => {
    (async () => {
      if (!isPorto) {
        setPortoIsRegistered(false);
        setPortoMaciStateIndex(undefined);
        return;
      }

      if (!isConnected) {
        setPortoIsRegistered(false);
        return;
      }

      if (!portoMaciKeypair) {
        setPortoIsRegistered(false);
        setPortoMaciStateIndex(undefined);
        return;
      }

      try {
        const { isRegistered: _isRegistered, stateIndex: _stateIndex } = await getSignedupUserData(
          subgraphUrl,
          portoMaciKeypair
        );

        setPortoIsRegistered(_isRegistered);
        setPortoMaciStateIndex(_stateIndex);
      } catch (error) {
        console.log(error);
        setPortoIsRegistered(false);
      }
    })();
  }, [portoMaciKeypair, isConnected, subgraphUrl, isPorto]);

  // // generate maci state tree locally
  useEffect(() => {
    (async () => {
      if (!signer) {
        setInclusionProof(null);
        return;
      }

      if (!tempMaciKeypair) {
        setInclusionProof(null);
        return;
      }

      if (!tempIsRegistered) {
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
  }, [tempMaciKeypair, tempIsRegistered, tempStateIndex, pollAddress, signer, getInclusionProof]);

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

      if (!tempMaciKeypair) {
        setIsCheckingUserJoinedPoll(false);
        return;
      }

      if (!tempIsRegistered) {
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
          tempMaciKeypair
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
  }, [tempIsRegistered, tempStateIndex, tempMaciKeypair, pollAddress, signer, subgraphUrl]);

  const value = useMemo<IPollContextType>(
    () => ({
      isJoiningPoll: isLoading,
      error: error,
      poll: poll ? { ...poll, status: dynamicPollStatus || poll.status } : poll,
      isRegistered: tempIsRegistered,
      maciKeypair: tempMaciKeypair,
      pollLoading,
      isPollError,
      isPorto,
      pollError,
      hasJoinedPoll,
      initialVoiceCredits,
      pollStateIndex,
      tempStateIndex,
      onJoinPoll,
      onSignup,
      refetchPoll,
      checkMergeStatus,
      checkIsTallied,
      dynamicPollStatus,
      isSignupLoading,
      isCheckingTallied,
      isCheckingUserJoinedPoll
    }),
    [
      isLoading,
      error,
      poll,
      dynamicPollStatus,
      tempIsRegistered,
      tempMaciKeypair,
      pollLoading,
      isPollError,
      isPorto,
      pollError,
      hasJoinedPoll,
      initialVoiceCredits,
      pollStateIndex,
      tempStateIndex,
      onJoinPoll,
      onSignup,
      refetchPoll,
      checkMergeStatus,
      checkIsTallied,
      isSignupLoading,
      isCheckingTallied,
      isCheckingUserJoinedPoll
    ]
  );

  return <PollContext.Provider value={value as IPollContextType}>{children}</PollContext.Provider>;
};
