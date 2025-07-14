import { useState, useCallback } from 'react'
import Link from 'next/link'
import { CID } from 'multiformats'
import { fromHex } from 'multiformats/bytes'
import { EMode, PollType, type PollOption } from '@/types'
import { GoLink } from 'react-icons/go'
import styles from './index.module.css'
import { useAccount } from 'wagmi'
import { WeightInput } from './components'
import OptionDetailsModal from './OptionDetailsModal'
import { MarkdownRenderer } from '@/components/shared'

interface VoteCardProps {
  option: PollOption
  votes: number | string
  result?: {
    candidate: string
    votes: number
  }
  totalVotes: number
  isWinner: boolean
  index: number
  pollOpen: boolean
  pollType: PollType
  isInvalid: boolean
  isSelected: boolean
  onVoteChange: (index: number, votes: string) => void
  onInvalidStatusChange: (status: boolean) => void
  handleWeightedVoteChange: (prevVotes: string | undefined, votes: string, index: number) => void
  onSelect: (index: number) => void
  maxVotePerPerson?: number
  onVote: () => void
  isLoading: boolean
  isUserRegistered: boolean
  isQv: EMode
}

const VoteCard = ({
  votes,
  option,
  result,
  totalVotes,
  isWinner,
  pollType,
  isInvalid,
  pollOpen,
  index,
  isUserRegistered,
  handleWeightedVoteChange,
  onVoteChange,
  onInvalidStatusChange,
  maxVotePerPerson,
  onVote,
  isLoading,
  isQv
}: VoteCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isConnected } = useAccount()
  const { description, name: title, cid, link } = option

  const handleVoteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isUserRegistered || !isConnected) {
        // notification.error('Please register to vote')
        console.log('Please register to vote')
        return
      }
      const isChecked = e.target.checked

      console.log(pollType, isChecked)
      if (isChecked) {
        switch (pollType) {
          case PollType.SINGLE_VOTE:
          case PollType.MULTIPLE_VOTE:
            onVoteChange(index, '1')
            break
          case PollType.WEIGHTED_MULTIPLE_VOTE:
            // For weighted votes, we'll handle the vote count in a separate input
            onInvalidStatusChange(true)
            break
        }
      } else {
        onVoteChange(index, '0')
        onInvalidStatusChange(false)
      }
    },
    [index, pollType, onVoteChange, onInvalidStatusChange]
  )

  const votePercentage =
    totalVotes > 0 && result ? Math.round((result.votes / totalVotes) * 100) : 0

  return (
    <>
      <label
        htmlFor={`candidate-votes-${index}`}
        className={`${styles.card} ${Number(votes) !== 0 ? styles.selected : ''} ${
          isWinner ? styles.winner : ''
        } ${!option.description && styles.noDescription}`}
      >
        {option.cid && option.cid !== '0x' && option.cid.length > 2 && (
          <div className={styles.image}>
            <img
              src={`${process.env.NEXT_PUBLIC_LH_GATEWAY}/ipfs/${CID.decode(
                fromHex(option.cid.startsWith('0x') ? option.cid.slice(2) : option.cid)
              ).toString()}`}
              alt={option.name}
              width={400}
              height={400}
            />
          </div>
        )}

        <div className={styles.content}>
          <h3 className={Number(votes) !== 0 ? styles.selected : ''}>{title}</h3>
          {description && <MarkdownRenderer content={description}></MarkdownRenderer>}
          {(link || description) && (
            <div className={styles.actions}>
              {link && (
                <Link className={styles.link} href={link} target="_blank" rel="noopener noreferrer">
                  <GoLink fill="#7F58B7" size={20} />{' '}
                  <span className={styles['link-text']}>Link</span>
                </Link>
              )}
              {description && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    if (pollType === PollType.SINGLE_VOTE) {
                      onVoteChange(index, '1')
                    }
                    setIsModalOpen(true)
                  }}
                  className={styles.viewMore}
                >
                  View More
                </button>
              )}
            </div>
          )}
        </div>
        {pollOpen && (
          <div className={styles.voteControls}>
            {pollType !== PollType.WEIGHTED_MULTIPLE_VOTE && (
              <div className={styles['vote-label-container']}>
                <input
                  type={pollType === PollType.SINGLE_VOTE ? 'radio' : 'checkbox'}
                  id={`candidate-votes-${index}`}
                  name={
                    pollType === PollType.SINGLE_VOTE
                      ? 'candidate-votes'
                      : `candidate-votes-${index}`
                  }
                  style={{ display: 'none' }}
                  checked={Number(votes) !== 0}
                  onChange={handleVoteChange}
                />
              </div>
            )}

            {pollType === PollType.WEIGHTED_MULTIPLE_VOTE && (
              <WeightInput
                index={index}
                isQv={isQv}
                votes={votes}
                maxVotePerPerson={maxVotePerPerson}
                handleWeightedVoteChange={handleWeightedVoteChange}
                isInvalid={isInvalid}
              />
            )}
          </div>
        )}

        {result && !pollOpen && (
          <div className={`${styles.result} ${!option.description && styles.vertical}`}>
            <div className={styles.voteBar}>
              <div className={styles.voteProgress} style={{ width: `${votePercentage}%` }} />
            </div>
            <span className={styles.voteCount}>
              {result.votes} votes ({votePercentage}%)
            </span>
          </div>
        )}
      </label>
      <OptionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description || ''}
        imageUrl={
          cid && cid !== '0x' && cid.length > 2
            ? `${process.env.NEXT_PUBLIC_LH_GATEWAY}/ipfs/${CID.decode(
                fromHex(cid.startsWith('0x') ? cid.slice(2) : cid)
              ).toString()}`
            : undefined
        }
        link={link}
        pollType={pollType}
        isLoading={isLoading}
        onVote={pollType === PollType.SINGLE_VOTE && pollOpen ? onVote : undefined}
      />
    </>
  )
}

export default VoteCard
