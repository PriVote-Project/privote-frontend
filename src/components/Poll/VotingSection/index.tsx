import Link from 'next/link'
import styles from '@/styles/userPoll.module.css'
import VoteCard from '../VoteCard'
// import { useAnonAadhaar } from '@anon-aadhaar/react'
import { MarkdownRenderer } from '@/components/shared'
import { useVotingState } from '@/hooks/useVotingState'
import { useCallback, useState, useEffect, useRef } from 'react'
import VoteSummarySection from '../VoteSummarySection'
import { type PollOption, PollType, PollStatus, EMode } from '@/types'

interface VotingSectionProps {
  votes: { index: number; votes: string }[]
  pollId: bigint
  isQv: EMode
  pollTitle: string
  pollDescription?: string
  pollStatus?: PollStatus
  pollType: PollType
  authType: string
  maxVotePerPerson?: number
  options: PollOption[] | undefined
  pollDeployer: string
  userAddress?: string
  isConnected: boolean
  isUserJoined: boolean
  result: { candidate: string; votes: number }[] | null
  totalVotes: number
  isVotesInvalid: Record<number, boolean>
  selectedCandidate: number | null
  isPending: boolean
  onVoteUpdate: (index: number, checked: boolean, votes: string) => void
  setIsVotesInvalid: (status: Record<number, boolean>) => void
  setSelectedCandidate: (index: number | null) => void
  onVote: () => void
}

export const VotingSection = ({
  votes,
  pollId,
  isQv,
  pollTitle,
  pollDescription,
  maxVotePerPerson,
  pollStatus,
  pollType,
  authType,
  options,
  pollDeployer,
  userAddress,
  isConnected,
  isUserJoined,
  result,
  totalVotes,
  isVotesInvalid,
  selectedCandidate,
  isPending,
  onVoteUpdate,
  setIsVotesInvalid,
  setSelectedCandidate,
  onVote
}: VotingSectionProps) => {
  // const [AnonAadhaar] = useAnonAadhaar()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isContentOverflowing, setIsContentOverflowing] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  console.log(pollDeployer)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Check initially
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        // Get the line height from computed styles
        const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight)
        const maxHeight = lineHeight * 4 // Height for 4 lines

        // Check if content height is greater than max height
        setIsContentOverflowing(descriptionRef.current.scrollHeight > maxHeight)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => window.removeEventListener('resize', checkOverflow)
  }, [pollDescription])

  const votingState = useVotingState({
    authType,
    pollStatus,
    isConnected,
    isUserRegistered: isUserJoined,
    anonAadhaarStatus: 'idle',
    isVotesInvalid: Object.values(isVotesInvalid).some((v) => v)
  })

  const handleVoteChange = useCallback(
    (index: number, votes: string) => {
      onVoteUpdate(index, true, votes)
    },
    [onVoteUpdate]
  )

  const handleInvalidStatusChange = useCallback(
    (index: number, status: boolean) => {
      setIsVotesInvalid({ ...isVotesInvalid, [index]: status })
    },
    [isVotesInvalid, setIsVotesInvalid]
  )

  const handleSelect = useCallback(
    (index: number) => {
      if (pollType === PollType.SINGLE_VOTE) {
        setSelectedCandidate(index)
        // Reset invalid status for all options when selecting in single vote mode
        setIsVotesInvalid(
          Object.keys(isVotesInvalid).reduce((acc, key) => ({ ...acc, [key]: false }), {})
        )
      } else {
        setSelectedCandidate(index)
        setIsVotesInvalid({ ...isVotesInvalid, [index]: false })
      }
    },
    [pollType, setSelectedCandidate, setIsVotesInvalid, isVotesInvalid]
  )

  const currentTotalVotes = votes ? votes.reduce((acc, v) => acc + Number(v.votes), 0) : 0

  const handleWeightedVoteChange = useCallback(
    (prevVotes: string | undefined, votes: string, index: number) => {
      if (!isConnected) {
        // notification.error('Please connect your wallet')
        return
      }

      if (!isUserJoined) {
        // notification.error('Please register to vote')
        return
      }

      if (Number(votes) < 0) return
      if (
        maxVotePerPerson &&
        currentTotalVotes - (Number(prevVotes) ?? 0) + Number(votes) > maxVotePerPerson
      ) {
        // notification.info('You have reached the maximum vote limit')
        return
      }
      handleVoteChange(index, votes)
    },
    [maxVotePerPerson, handleVoteChange, isConnected, isUserJoined]
  )

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
                  isMobile
                    ? isExpanded
                      ? pollDescription
                      : pollDescription.substring(0, 220)
                    : pollDescription
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
          <img src={'/info.svg'} alt="info" width={24} height={24} />
          <p>
            As no one knows whom you voted for, you can change your vote at any time before the poll
            ends. Only the last vote counts.
          </p>
        </div>
      )}
      <h2 className={styles.heading}>Poll Options</h2>
      <VoteSummarySection
        isQv={isQv}
        pollType={pollType}
        options={options}
        votes={votes}
        maxVotePerPerson={maxVotePerPerson}
        currentTotalVotes={votes.reduce((acc, v) => acc + Number(v.votes), 0)}
        onVoteChange={handleVoteChange}
        onVote={onVote}
        isLoading={isPending}
        handleWeightedVoteChange={handleWeightedVoteChange}
        canVote={votingState.canVote}
      >
        <ul className={styles['candidate-list']}>
          {options &&
            (pollStatus === PollStatus.RESULT_COMPUTED && result
              ? [...options]
                  .map((option, index: number) => ({
                    option,
                    votes: result.find((r) => r.candidate === option.name)?.votes || 0,
                    prevIndex: index
                  }))
                  .sort((a, b) => b.votes - a.votes)
              : options.map((option, index) => ({
                  option,
                  votes: votes.find((v) => v.index === index)?.votes || 0,
                  prevIndex: index
                }))
            ).map(({ option, votes, prevIndex }) => (
              <VoteCard
                key={prevIndex}
                option={option}
                isQv={isQv}
                votes={votes}
                pollOpen={pollStatus === PollStatus.OPEN}
                maxVotePerPerson={maxVotePerPerson}
                index={prevIndex}
                result={result?.find((r) => r.candidate === option.name)}
                totalVotes={totalVotes}
                isUserRegistered={isUserJoined}
                handleWeightedVoteChange={handleWeightedVoteChange}
                isWinner={result?.[0]?.candidate === option.name}
                pollType={PollType.SINGLE_VOTE}
                isInvalid={Boolean(isVotesInvalid[prevIndex])}
                onVoteChange={(index, votes) => {
                  handleVoteChange(index, votes)
                }}
                onInvalidStatusChange={(status) => handleInvalidStatusChange(prevIndex, status)}
                onSelect={() => handleSelect(prevIndex)}
                isSelected={selectedCandidate === prevIndex}
                onVote={onVote}
                isLoading={isPending}
              />
            ))}
        </ul>
      </VoteSummarySection>
      {votingState.message && pollStatus === PollStatus.OPEN && (
        <p className={styles.message}>{votingState.message}</p>
      )}
      {votingState.canVote && (
        <div className={styles.col}>
          {pollType !== PollType.WEIGHTED_MULTIPLE_VOTE && (
            <button
              className={styles['poll-btn']}
              onClick={onVote}
              disabled={isPending || Object.values(isVotesInvalid).some((v) => v)}
            >
              {isPending ? <span className={`${styles.spinner} spinner`}></span> : <p>Vote Now</p>}
            </button>
          )}
        </div>
      )}
      {pollStatus === PollStatus.CLOSED && pollDeployer === userAddress?.toLowerCase() && (
        <Link href={`/polls/${pollId}/publish`} className={styles['poll-btn']}>
          {isPending ? (
            <span className={`${styles.spinner} spinner`}></span>
          ) : (
            <p>Publish Results</p>
          )}
        </Link>
      )}
    </div>
  )
}

export default VotingSection
