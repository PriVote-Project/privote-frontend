'use client'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import { EMode } from '@/types'

interface WeightInputProps {
  index: number
  votes: number | string
  maxVotePerPerson: number | undefined
  handleWeightedVoteChange: (prevVotes: string | undefined, votes: string, index: number) => void
  isInvalid: boolean
  isQv: EMode
}

const WeightInput = ({
  index,
  votes,
  maxVotePerPerson,
  handleWeightedVoteChange,
  isInvalid,
  isQv
}: WeightInputProps) => {
  const [showInitial, setShowInitial] = useState(true)

  useEffect(() => {
    if (Number(votes) > 0) setShowInitial(false)
  }, [votes])

  return (
    <div className={styles['mw']}>
      <div className={styles.box}>
        <button
          type="button"
          onClick={() => {
            if (Number(votes) > 0) {
              // setShowInitial(false);
              const newValue = Number(votes) - 1
              handleWeightedVoteChange(votes.toString(), newValue.toString(), index)
            }
          }}
        >
          <img src="/minus.svg" alt="minus" width={16} height={16} />
        </button>
        <input
          type="text"
          onChange={(e) => {
            setShowInitial(false)
            const value = e.target.value
            // Only allow numeric input (empty or numbers)
            if (value === '' || /^\d+$/.test(value)) {
              handleWeightedVoteChange(votes.toString(), value, index)
            }
          }}
          min={0}
          max={maxVotePerPerson}
          value={showInitial ? '0' : votes}
          className={`${styles.weightInput} ${isInvalid ? styles.invalid : ''}`}
        />
        <button
          type="button"
          onClick={() => {
            const newValue = Number(votes) + 5
            if (!maxVotePerPerson || Number(newValue) <= maxVotePerPerson) {
              // setShowInitial(false);
              handleWeightedVoteChange(votes.toString(), newValue.toString(), index)
            }
          }}
        >
          <img src="/plus.svg" alt="plus" width={16} height={16} />
        </button>
      </div>
      {isQv === EMode.QV && (
        <div className={styles['vote-weight']}>
          <p>Weight: {Math.floor(Math.sqrt(Number(votes)))}</p>
        </div>
      )}
    </div>
  )
}

export default WeightInput
