import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { type IPollContextType } from './types';
import {
  downloadPollJoiningArtifactsBrowser,
  joinPoll,
  MaciSubgraph,
  generateSignUpTreeFromKeys
} from '@maci-protocol/sdk/browser';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import usePrivoteContract from '@/hooks/usePrivoteContract';
import { useSigContext } from './SigContext';
import { MACI_SUBGRAPH_ENDPOINT, DEFAULT_IVCP_DATA, DEFAULT_SG_DATA } from '@/utils/constants';
import { getJoinedUserData } from '@/utils/subgraph';
import { usePoll } from '@/hooks/usePoll';
import { notification, handleNotice } from '@/utils/notification';

export const PollContext = createContext<IPollContextType | undefined>(undefined);

export const PollProvider = ({ pollAddress, children }: { pollAddress: string; children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // MACI contract
  const [inclusionProof, setInclusionProof] = useState<any>(null);

  // Artifacts
  const [artifacts, setArtifacts] = useState<
    Awaited<ReturnType<typeof downloadPollJoiningArtifactsBrowser>> | undefined
  >();

  // Poll contract
  const [hasJoinedPoll, setHasJoinedPoll] = useState<boolean>(false);
  const [initialVoiceCredits, setInitialVoiceCredits] = useState<number>(0);
  const [pollStateIndex, setPollStateIndex] = useState<string | undefined>(undefined);

  // Wallet variables
  const signer = useEthersSigner();

  // Poll
  const {
    data: poll,
    isLoading: pollLoading,
    isError: isPollError,
    error: pollError,
    refetch: refetchPoll
  } = usePoll({ pollAddress });

  const { maciKeypair, isRegistered, stateIndex } = useSigContext();
  const privoteContract = usePrivoteContract();

  // Functions
  const getInclusionProof = useCallback(async () => {
    if (!stateIndex) {
      return;
    }
    if (!maciKeypair) {
      return;
    }
    try {
      const subgraph = new MaciSubgraph(MACI_SUBGRAPH_ENDPOINT as string);
      const keys = await subgraph.getKeys();
      const signupTree = generateSignUpTreeFromKeys(keys);

      // Find the leaf's index directly from the tree to compare
      const treeIndex = signupTree.indexOf(maciKeypair.publicKey.hash());
      const inclusionProof = treeIndex !== -1 ? signupTree.generateProof(treeIndex) : null;
      setInclusionProof(inclusionProof);

      return inclusionProof;
    } catch (error) {
      console.error('Error getting inclusion proof', error);
    }
  }, [maciKeypair, stateIndex]);

  const onJoinPoll = useCallback(
    async (signupData: string = '0x') => {
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
      if (!artifacts) {
        setError('Artifacts not downloaded');
        setIsLoading(false);

        notification.error('Artifacts not downloaded');
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

      const notificationId = notification.loading('Joining poll...');

      const inclusionProofDirect = inclusionProof ?? (await getInclusionProof());

      let errorMessage: string = '';
      const joinedPoll = await joinPoll({
        maciAddress: privoteContract.address,
        privateKey: maciKeypair.privateKey.serialize(),
        signer,
        pollId: BigInt(poll.pollId),
        inclusionProof: inclusionProofDirect,
        pollJoiningZkey: artifacts.zKey as unknown as string,
        pollWasm: artifacts.wasm as unknown as string,
        sgDataArg: signupData || DEFAULT_SG_DATA,
        ivcpDataArg: DEFAULT_IVCP_DATA,
        blocksPerBatch: 1000000
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
    [artifacts, hasJoinedPoll, inclusionProof, isRegistered, maciKeypair, signer, stateIndex, poll]
  );

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
        const localInclusionProof = getInclusionProof();

        setInclusionProof(localInclusionProof);
      } catch (error) {
        console.log(error);
        setError('Error generating MACI state tree');
        setInclusionProof(null);
      }
    })();
  }, [isRegistered, maciKeypair, pollAddress, signer, stateIndex]);

  // check poll user data
  useEffect(() => {
    (async () => {
      setHasJoinedPoll(false);
      setInitialVoiceCredits(0);
      setPollStateIndex(undefined);

      if (!signer) {
        return;
      }

      if (!maciKeypair) {
        return;
      }

      if (!isRegistered) {
        return;
      }

      // if it is the first poll then !pollId = false because !0n = false
      if (!pollAddress) {
        return;
      }

      try {
        const { isJoined, voiceCredits, pollStateIndex } = await getJoinedUserData(pollAddress, maciKeypair);

        setHasJoinedPoll(isJoined);
        setInitialVoiceCredits(Number(voiceCredits));
        setPollStateIndex(pollStateIndex);
      } catch (error) {
        console.log(error);
        setError('Error checking if user has joined poll');
      }
    })();
  }, [isRegistered, maciKeypair, pollAddress, signer, stateIndex]);

  // download poll joining artifacts and store them in state
  useEffect(() => {
    (async () => {
      const downloadedArtifacts = await downloadPollJoiningArtifactsBrowser({
        testing: true,
        stateTreeDepth: 10
      });
      setArtifacts(downloadedArtifacts);
    })();
  }, []);

  const value = useMemo<IPollContextType>(
    () => ({
      isLoading,
      error,
      poll,
      pollLoading,
      isPollError,
      pollError,
      hasJoinedPoll,
      initialVoiceCredits,
      pollStateIndex,
      stateIndex,
      onJoinPoll,
      refetchPoll
    }),
    [
      isLoading,
      error,
      poll,
      pollLoading,
      isPollError,
      pollError,
      hasJoinedPoll,
      initialVoiceCredits,
      pollStateIndex,
      stateIndex,
      onJoinPoll,
      refetchPoll
    ]
  );

  return <PollContext.Provider value={value as IPollContextType}>{children}</PollContext.Provider>;
};
