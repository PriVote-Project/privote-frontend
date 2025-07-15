import PollAbi from '@/abi/Poll';
import { EMode, PollStatus, PollType } from '@/types';
import { handleNotice, notification } from '@/utils/notification';
import { Keypair, PublicKey, VoteCommand } from '@maci-protocol/domainobjs';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';

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
  const [votes, setVotes] = useState<{ index: number; votes: string }[]>([]);
  const [isVotesInvalid, setIsVotesInvalid] = useState<Record<number, boolean>>({});
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  const { writeContractAsync, isPending } = useWriteContract();

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

    const notificationId = notification.loading('Submitting votes...');

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
      if (votesToMessage.length === 1) {
        await writeContractAsync(
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
        setSelectedCandidate(null);
      } else {
        await writeContractAsync(
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
        setSelectedCandidate(null);
      }

      setVotes([]);
    } catch (err) {
      console.error('err', err);
    } finally {
      if (notificationId) notification.remove(notificationId);
    }
  };

  return {
    votes,
    isVotesInvalid,
    selectedCandidate,
    isPending,
    setIsVotesInvalid,
    setSelectedCandidate,
    voteUpdated,
    castVote
  };
};

export default useVoting;
