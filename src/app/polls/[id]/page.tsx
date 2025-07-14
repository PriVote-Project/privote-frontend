'use client'
import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PollProvider } from '@/contexts/PollContext'
import { PollDetails } from '@/components/Poll'
import styles from '@/styles/pollDetails.module.css'
import { usePoll } from '@/hooks/usePollContext'
import Button from '@/components/shared/Button'

const PollDetail: React.FC = () => {
  // Get poll ID from URL parameters
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Invalid poll ID</div>
  }

  return (
    <PollProvider pollAddress={id}>
      <UserPoll />
    </PollProvider>
  )
}

const UserPoll = () => {
  const { pollError, pollLoading, poll } = usePoll()

  if (pollError) {
    return (
      <div className={styles.container}>
        <Link href={'/polls'} className={styles.back}>
          <img src="/arrow-left.svg" alt="arrow left" width={27} height={27} />
        </Link>
        <div className={styles['error-state']}>
          <h3>Failed to Load Poll</h3>
          <p>We couldn't load the poll details. Please try again later.</p>
          <Button className={styles['retry-btn']} action={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (pollLoading) {
    return (
      <div className={styles.container}>
        <Link href={'/'} className={styles.back}>
          <img src="/arrow-left.svg" alt="arrow left" width={27} height={27} />
        </Link>
        <div className={styles['loading-state']}>
          <div className="spinner large"></div>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className={styles.container}>
        <Link href={'/polls'} className={styles.back}>
          <img src="/arrow-left.svg" alt="arrow left" width={27} height={27} />
        </Link>
        <div className={styles['error-state']}>
          <h3>Failed to Load Poll</h3>
          <p>We couldn't load the poll details. Please try again later.</p>
          <Button className={styles['retry-btn']} action={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['main-container']}>
      <PollDetails pollAddress={poll.id} />
    </div>
  )
}

export default PollDetail
