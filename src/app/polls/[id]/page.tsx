'use client';
import { PollHeader, VotingSection } from '@/components/Poll';
import { EmptyState, ErrorState } from '@/components/shared';
import { PollProvider } from '@/contexts/PollContext';
import usePollContext from '@/hooks/usePollContext';
import styles from '@/styles/poll.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const PollDetail: React.FC = () => {
  // Get poll ID from URL parameters
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <EmptyState title='Invalid Poll Id' description='Please try again with a valid poll id' />;
  }

  return (
    <PollProvider pollAddress={id}>
      <UserPoll />
    </PollProvider>
  );
};

const UserPoll = () => {
  const { pollError, pollLoading, poll } = usePollContext();

  if (pollLoading) {
    return (
      <div className={styles.container}>
        <Link href={'/'} className={styles.back}>
          <img src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
        </Link>
        <div className={styles['loading-state']}>
          <div className='spinner large'></div>
        </div>
      </div>
    );
  }

  if (pollError) {
    return (
      <div className={styles.container}>
        <Link href={'/polls'} className={styles.back}>
          <img src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
        </Link>
        <ErrorState title='Failed to Load Poll' error={pollError} retryAction={() => window.location.reload()} />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className={styles.container}>
        <Link href={'/polls'} className={styles.back}>
          <img src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
        </Link>
        <ErrorState
          title='Failed to Load Poll'
          error={new Error("We couldn't load the poll details. Please try again later.")}
          retryAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className={styles['main-container']}>
      <div>
        <PollHeader />
        <VotingSection pollAddress={poll.id} />
      </div>
    </div>
  );
};

export default PollDetail;
