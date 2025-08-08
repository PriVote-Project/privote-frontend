'use client';
import { PollHeader, VotingSection } from '@/components/Poll';
import { EmptyState, ErrorState } from '@/components/shared';
import { PollProvider } from '@/contexts/PollContext';
import PollSigContextWrapper from '@/contexts/PollSigContextWrapper';
import usePollContext from '@/hooks/usePollContext';
import styles from '@/styles/poll.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const PollDetail: React.FC = () => {
  // Get poll ID from URL parameters
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <EmptyState title='Invalid Poll Id' description='Please try again with a valid poll id' />;
  }

  return <UserPoll pollAddress={id} />;
};

const UserPoll = ({ pollAddress }: { pollAddress: string }) => {
  // First, get basic poll info to set up context
  return (
    <PollProvider pollAddress={pollAddress}>
      <PollDataLoader />
    </PollProvider>
  );
};

const PollDataLoader = () => {
  const { pollError, pollLoading, poll } = usePollContext();

  if (pollLoading) {
    return (
      <div className={styles.container}>
        <Link href={'/'} className={styles.back}>
          <Image src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
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
          <Image src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
        </Link>
        <ErrorState title='Failed to Load Poll' error={pollError} retryAction={() => window.location.reload()} />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className={styles.container}>
        <Link href={'/polls'} className={styles.back}>
          <Image src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
        </Link>
        <ErrorState
          title='Failed to Load Poll'
          error={new Error("We couldn't load the poll details. Please try again later.")}
          retryAction={() => window.location.reload()}
        />
      </div>
    );
  }

  // Convert endDate to ISO string for JWT expiry
  const pollEndDate = new Date(parseInt(poll.endDate) * 1000).toISOString();

  // Now wrap with poll-specific context and recreate PollProvider inside it
  return (
    <PollSigContextWrapper pollId={poll.pollId} pollEndDate={pollEndDate}>
      <PollProvider pollAddress={poll.id}>
        <UserPollContent />
      </PollProvider>
    </PollSigContextWrapper>
  );
};

const UserPollContent = () => {
  const { pollError, pollLoading, poll } = usePollContext();
  
  if (pollLoading || !poll) {
    return <div className='spinner large'></div>;
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
