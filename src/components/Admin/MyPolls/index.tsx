import React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePolls } from '@/hooks/usePolls';
import PollItem from '@/components/Polls/PollItem';
import { Button } from '@/components/shared';
import styles from './index.module.css';

const MyPolls: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePolls({
    ownerAddress: address,
  });

  if (!isConnected) {
    return (
      <div className={styles['empty-state']}>
        <h3>Connect Your Wallet</h3>
        <p>Please connect your wallet to view your polls</p>
        <div className={styles['connect-button']}>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles['feedback-state']}>
        <p>Loading your polls...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles['feedback-state']}>
        <p>Error fetching polls. Please try again later.</p>
      </div>
    );
  }

  const polls = data?.pages.flat() || [];

  if (polls.length === 0) {
    return (
      <div className={styles['empty-state']}>
        <h3>No Polls Found</h3>
        <p>You have not created any polls yet.</p>
      </div>
    );
  }

  return (
    <div className={styles['polls-list-container']}>
      <ul className={styles['polls-list']}>
        {polls.map((poll) => (
          <PollItem key={poll.id} poll={poll} />
        ))}
      </ul>
      {hasNextPage && (
        <Button
          action={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className={styles.loadMoreButton}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
};

export default MyPolls;
