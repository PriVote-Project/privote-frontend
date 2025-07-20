import PollAbi from '@/abi/Poll';
import { EMode, PollStatus, PollType } from '@/types';
import { handleNotice, notification } from '@/utils/notification';
import { Keypair, PublicKey, VoteCommand } from '@maci-protocol/domainobjs';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

interface UseVotingProps {
  pollAddress?: string;
  pollType: PollType;
  status?: PollStatus;
  stateIndex: number | null;
  coordinatorPubKey?: PublicKey;
  keypair?: Keypair | null;
  pollId?: bigint;
  maxVotePerPerson?: number;
  mode?: EMode;
}

export const useVoting = ({
  pollAddress,
  pollType,
  status,
  stateIndex,
  coordinatorPubKey,
  keypair,
  pollId,
  maxVotePerPerson,
  mode
}: UseVotingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState<{ index: number; votes: string }[]>([]);
  const [isVotesInvalid, setIsVotesInvalid] = useState<Record<number, boolean>>({});

  const { writeContractAsync } = useWriteContract();

  const [txState, setTxState] = useState<{ hash: `0x${string}`; notificationId: string }>();

  const {
    isSuccess: isConfirmed,
    error: confirmError,
    data: receipt
  } = useWaitForTransactionReceipt({
    hash: txState?.hash,
    query: {
      enabled: !!txState?.hash
    }
  });

  useEffect(() => {
    if (!txState?.hash) return;
    if (isConfirmed && receipt) {
      handleNotice({
        message: 'Poll created successfully!',
        type: 'success',
        id: txState?.notificationId
      });
      setVotes([]);
      setIsLoading(false);
    } else if (confirmError) {
      handleNotice({
        message: 'Poll creation failed!',
        type: 'error',
        id: txState?.notificationId
      });
      setIsLoading(false);
    }
  }, [isConfirmed, confirmError, receipt, txState]);

  const getMessageAndEncKeyPair = (
    stateIndex: bigint,
    pollIndex: bigint,
    candidateIndex: bigint,
    weight: bigint,
    nonce: bigint,
    coordinatorPubKey: PublicKey,
    keypair: Keypair
  ) => {
    const command = new VoteCommand(stateIndex, keypair.publicKey, candidateIndex, weight, nonce, pollIndex);

    const signature = command.sign(keypair.privateKey);
    const encKeyPair = new Keypair();
    const message = command.encrypt(signature, Keypair.generateEcdhSharedKey(encKeyPair.privateKey, coordinatorPubKey));

    return { message, encKeyPair };
  };

  const voteUpdated = (index: number, checked: boolean, voteCounts: string) => {
    if (pollType === PollType.SINGLE_VOTE) {
      if (checked) {
        setVotes([{ index, votes: voteCounts }]);
      }
      return;
    }

    if (checked) {
      setVotes([...votes.filter(v => v.index !== index), { index, votes: voteCounts }]);
    } else {
      setVotes(votes.filter(v => v.index !== index));
    }
  };

  const castVote = async () => {
    if (
      pollAddress == null ||
      pollId == null ||
      stateIndex == null ||
      stateIndex <= 0 ||
      !coordinatorPubKey ||
      !keypair
    ) {
      console.log('Missing required parameters', pollAddress, pollId, stateIndex, coordinatorPubKey, keypair);
      notification.error('Error casting vote. Please refresh the page and try again.');
      return;
    }

    if (Object.values(isVotesInvalid).some(v => v)) {
      notification.error('Please enter a valid number of votes');
      return;
    }

    if (votes.length === 0) {
      notification.error('Please select at least one option to vote');
      return;
    }

    if (status !== PollStatus.OPEN) {
      notification.error('Voting is closed for this poll');
      return;
    }

    setIsLoading(true);

    // remove any votes from the array that are invalid
    let updatedVotes = votes
      .map(v => ({
        index: v.index,
        votes: parseInt(v.votes)
      }))
      .filter(v => !isNaN(v.votes));

    if (
      pollType === PollType.WEIGHTED_MULTIPLE_VOTE &&
      maxVotePerPerson &&
      updatedVotes.reduce((a, b) => a + b.votes, 0) > maxVotePerPerson
    ) {
      notification.error(`You can't vote more than ${maxVotePerPerson} per poll`);
      return;
    }

    if (pollType === PollType.WEIGHTED_MULTIPLE_VOTE && mode === EMode.QV) {
      updatedVotes = votes.map(v => ({
        index: v.index,
        votes: Math.floor(Math.sqrt(parseInt(v.votes)))
      }));
    }

    let notificationId = notification.loading('Submitting votes...');

    const votesToMessage = updatedVotes
      .sort((a, b) => a.index - b.index)
      .map((v, i) =>
        getMessageAndEncKeyPair(
          BigInt(stateIndex),
          pollId,
          BigInt(v.index),
          BigInt(v.votes),
          BigInt(updatedVotes.length - i),
          coordinatorPubKey,
          keypair
        )
      );

    try {
      let txHash: `0x${string}`;
      if (votesToMessage.length === 1) {
        txHash = await writeContractAsync(
          {
            abi: PollAbi,
            address: pollAddress as `0x${string}`,
            functionName: 'publishMessage',
            args: [
              votesToMessage[0].message.asContractParam() as unknown as {
                data: readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
              },
              votesToMessage[0].encKeyPair.publicKey.asContractParam() as unknown as {
                x: bigint;
                y: bigint;
              }
            ]
          },
          {
            onSuccess: () => {
              handleNotice({
                message: 'Votes submitted successfully!',
                type: 'success',
                id: notificationId
              });
            },
            onError: () =>
              handleNotice({
                message: 'Failed to submit votes, please try again',
                type: 'error',
                id: notificationId
              })
          }
        );
      } else {
        txHash = await writeContractAsync(
          {
            abi: PollAbi,
            address: pollAddress as `0x${string}`,
            functionName: 'publishMessageBatch',
            args: [
              votesToMessage.map(
                v =>
                  v.message.asContractParam() as unknown as {
                    data: readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
                  }
              ),
              votesToMessage.map(
                v =>
                  v.encKeyPair.publicKey.asContractParam() as {
                    x: bigint;
                    y: bigint;
                  }
              )
            ]
          },
          {
            onSuccess: () => {
              handleNotice({
                message: 'Votes submitted successfully!',
                type: 'success',
                id: notificationId
              });
            },
            onError: () =>
              handleNotice({
                message: 'Failed to submit votes, please try again',
                type: 'error',
                id: notificationId
              })
          }
        );
      }

      notificationId = handleNotice({
        message: 'Waiting for transaction confirmation...',
        type: 'loading',
        id: notificationId
      });

      setTxState({
        hash: txHash,
        notificationId
      });
    } catch (err) {
      console.error('Error submitting votes:', err);
      const errorMessage =
        err instanceof Error && err.message.includes('User rejected')
          ? 'Transaction cancelled by user'
          : 'Failed to submit votes. Please try again.';
      handleNotice({
        message: errorMessage,
        type: 'error',
        id: notificationId
      });
      setIsLoading(false);
    }
  };

  return {
    votes,
    isVotesInvalid,
    isPending: isLoading,
    setIsVotesInvalid,
    voteUpdated,
    castVote
  };
};

export default useVoting;
