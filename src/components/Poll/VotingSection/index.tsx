import pollAbi from '@/abi/Poll';
import { MarkdownRenderer } from '@/components/shared';
import { useSigContext } from '@/contexts/SigContext';
import usePollContext from '@/hooks/usePollContext';
import usePollResults from '@/hooks/usePollResults';
import useVoting from '@/hooks/useVoting';
import { PollStatus, PollType } from '@/types';
import { notification } from '@/utils/notification';
import { PublicKey } from '@maci-protocol/domainobjs';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import VoteCard from '../VoteCard';
import VoteSummarySection from '../VoteSummarySection';
import styles from './index.module.css';

interface VotingSectionProps {
  pollAddress: string;
}

export const VotingSection = ({ pollAddress }: VotingSectionProps) => {
  // const [AnonAadhaar] = useAnonAadhaar()
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [coordinatorPubKey, setCoordinatorPubKey] = useState<PublicKey>();
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const { isConnected, address: userAddress } = useAccount();
  const { poll, pollStateIndex, hasJoinedPoll: isUserJoined } = usePollContext();
  const { maciKeypair } = useSigContext();
  const { data: resultData } = usePollResults();
  const {
    mode,
    pollType,
    name: pollTitle,
    description: pollDescription,
    maxVotePerPerson,
    options,
    status: pollStatus,
    owner: pollDeployer
  } = poll!;
  const isTallied = resultData?.tallied || false;
  const totalVotes = resultData?.total || BigInt(0);
  const pollResults = resultData?.results;

  const { data: coordinatorPubKeyResult } = useReadContract({
    abi: pollAbi,
    address: pollAddress as `0x${string}`,
    functionName: 'coordinatorPublicKey'
  });

  const {
    votes,
    isVotesInvalid,
    setIsVotesInvalid,
    voteUpdated: onVoteUpdate,
    castVote: onVote,
    isPending
  } = useVoting({
    coordinatorPubKey,
    pollAddress: poll?.id,
    mode: poll?.mode,
    pollType: poll?.pollType || PollType.NOT_SELECTED,
    status: poll?.status,
    keypair: maciKeypair,
    pollId: BigInt(poll?.pollId || 0),
    stateIndex: Number(pollStateIndex),
    maxVotePerPerson: Number(poll?.maxVotePerPerson || 0)
  });

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check initially
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        // Get the line height from computed styles
        const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight);
        const maxHeight = lineHeight * 4; // Height for 4 lines

        // Check if content height is greater than max height
        setIsContentOverflowing(descriptionRef.current.scrollHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, [pollDescription]);

  const handleVoteChange = useCallback(
    (index: number, votes: string) => {
      onVoteUpdate(index, true, votes);
    },
    [onVoteUpdate]
  );

  const handleInvalidStatusChange = useCallback(
    (index: number, status: boolean) => {
      setIsVotesInvalid({ ...isVotesInvalid, [index]: status });
    },
    [isVotesInvalid, setIsVotesInvalid]
  );

  const currentTotalVotes = votes ? votes.reduce((acc, v) => acc + Number(v.votes), 0) : 0;

  const handleWeightedVoteChange = useCallback(
    (prevVotes: string | undefined, votes: string, index: number) => {
      if (!isConnected) {
        notification.error('Please connect your wallet');
        return;
      }

      if (!isUserJoined) {
        notification.error('Please register to vote');
        return;
      }

      if (Number(votes) < 0) return;
      if (
        Number(maxVotePerPerson) &&
        currentTotalVotes - (Number(prevVotes) ?? 0) + Number(votes) > Number(maxVotePerPerson)
      ) {
        notification.info('You have reached the maximum vote limit');
        return;
      }
      handleVoteChange(index, votes);
    },
    [maxVotePerPerson, handleVoteChange, isConnected, isUserJoined]
  );

  useEffect(() => {
    if (!coordinatorPubKeyResult) return;
    try {
      const publicKey = new PublicKey([
        BigInt((coordinatorPubKeyResult as bigint[])[0].toString()),
        BigInt((coordinatorPubKeyResult as bigint[])[1].toString())
      ]);
      setCoordinatorPubKey(publicKey);
    } catch (err) {
      console.error('Error setting coordinator public key:', err);
    }
  }, [coordinatorPubKeyResult]);

  return (
    <div className={styles['candidate-container']}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{pollTitle}</h1>
        {pollDescription && (
          <div>
            <div
              ref={descriptionRef}
              className={`description ${
                !isExpanded && isContentOverflowing && isMobile ? styles.descriptionTruncated : ''
              }`}
            >
              <MarkdownRenderer
                content={
                  isMobile ? (isExpanded ? pollDescription : pollDescription.substring(0, 220)) : pollDescription
                }
              />
              {isMobile && (
                <span className={styles.showMoreButton} onClick={() => setIsExpanded(!isExpanded)}>
                  {' '}
                  {isExpanded ? 'Show less' : '...read more'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {pollStatus === PollStatus.OPEN && (
        <div className={styles.info}>
          <img src={'/info.svg'} alt='info' width={24} height={24} />
          <p>
            As no one knows whom you voted for, you can change your vote at any time before the poll ends. Only the last
            vote counts.
          </p>
        </div>
      )}
      <h2 className={styles.heading}>Poll Options</h2>
      <VoteSummarySection
        mode={mode}
        pollType={pollType}
        options={options}
        votes={votes}
        maxVotePerPerson={Number(maxVotePerPerson || 0)}
        currentTotalVotes={votes.reduce((acc, v) => acc + Number(v.votes), 0)}
        onVoteChange={handleVoteChange}
        onVote={onVote}
        isLoading={isPending}
        handleWeightedVoteChange={handleWeightedVoteChange}
        canVote={isUserJoined}
      >
        <ul className={styles['candidate-list']}>
          {options &&
            (isTallied && pollResults
              ? [...options]
                  .map((option, index: number) => ({
                    option,
                    votes: pollResults ? Number(pollResults[index].value) || 0 : 0,
                    prevIndex: index
                  }))
                  .sort((a, b) => b.votes - a.votes)
              : options.map((option, index) => ({
                  option,
                  votes: Number(votes.find(v => v.index === index)?.votes) || 0,
                  prevIndex: index
                }))
            ).map(({ option, votes, prevIndex }, index) => (
              <VoteCard
                key={prevIndex}
                option={option}
                mode={mode}
                votes={votes}
                isTallied={isTallied}
                pollOpen={pollStatus === PollStatus.OPEN}
                maxVotePerPerson={Number(maxVotePerPerson || 1)}
                index={prevIndex}
                totalVotes={Number(totalVotes || 0)}
                isUserRegistered={isUserJoined}
                handleWeightedVoteChange={handleWeightedVoteChange}
                isWinner={isTallied && index === 0}
                pollType={PollType.SINGLE_VOTE}
                isInvalid={Boolean(isVotesInvalid[prevIndex])}
                onVoteChange={(index, votes) => {
                  handleVoteChange(index, votes);
                }}
                onInvalidStatusChange={status => handleInvalidStatusChange(prevIndex, status)}
                onVote={onVote}
                isLoading={isPending}
              />
            ))}
        </ul>
      </VoteSummarySection>
      {isUserJoined && pollStatus === PollStatus.OPEN && (
        <div className={styles.col}>
          {pollType !== PollType.WEIGHTED_MULTIPLE_VOTE && (
            <button
              className={styles['poll-btn']}
              onClick={onVote}
              disabled={isPending || Object.values(isVotesInvalid).some(v => v)}
            >
              {isPending ? <span className={`${styles.spinner} spinner`}></span> : <p>Vote Now</p>}
            </button>
          )}
        </div>
      )}
      {pollStatus === PollStatus.CLOSED && !isTallied && pollDeployer === userAddress?.toLowerCase() && (
        <Link href={`/polls/${pollAddress}/publish`} className={styles['poll-btn']}>
          {isPending ? <span className={`${styles.spinner} spinner`}></span> : <p>Publish Results</p>}
        </Link>
      )}
    </div>
  );
};

export default VotingSection;
