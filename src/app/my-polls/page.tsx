'use client';
import { CreatePollForm, UserPolls } from '@/components/MyPolls';
import { PollFormProvider } from '@/components/MyPolls/CreatePollForm/context';
import { Button } from '@/components/shared';
import styles from '@/styles/admin.module.css';
import React from 'react';
import { useAccount } from 'wagmi';

const MyPollsPage: React.FC = () => {
  const [showCreatePoll, setShowCreatePoll] = React.useState(false);
  const { isConnected } = useAccount();
  return (
    <PollFormProvider>
      <div className={styles.wrapper}>
        <div className={styles['admin-page']}>
          <div className={styles.header}>
            {!showCreatePoll && isConnected && (
              <Button className={styles.btn} action={() => setShowCreatePoll(true)}>
                Create Poll
              </Button>
            )}
          </div>
          {!showCreatePoll && <UserPolls />}
          {showCreatePoll && isConnected && <CreatePollForm onClose={() => setShowCreatePoll(false)} />}
        </div>
      </div>
    </PollFormProvider>
  );
};

export default MyPollsPage;
