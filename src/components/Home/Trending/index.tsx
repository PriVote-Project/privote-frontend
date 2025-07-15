import React from 'react';
import { usePolls } from '@/hooks/usePolls';
import PollItem from '@/components/Polls/PollItem';
import styles from './index.module.css';
import { EmptyState, ErrorState } from '@/components/shared';

const Trending: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = usePolls({
    orderBy: 'createdAt',
    orderDirection: 'desc',
    limit: 3
  });

  const polls = data?.pages.flat().slice(0, 3) || [];

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h4>Trending Polls</h4>
      </div>
      <div className={styles['polls-container']}>
        {isLoading && <div className={`spinner ${styles.loader}`}></div>}
        {isError && <ErrorState title='Error Loading Trending Polls' error={error} retryAction={refetch} />}
        {!isLoading && !isError && polls.length === 0 && (
          <EmptyState title='No Trending Polls Found' description='There are no trending polls' />
        )}
        {!isLoading && !isError && polls.length > 0 && (
          <ul className={styles['polls-list']}>
            {polls.map(poll => (
              <PollItem key={poll.id} poll={poll} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Trending;
