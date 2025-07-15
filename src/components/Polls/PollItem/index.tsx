import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';
import { PollStatus, type Poll } from '@/types';
import Circle from '@/assets/circle.svg';
import { POLICY_ICONS } from '@/utils/constants';

interface PollItemProps {
  poll: Poll;
}

const PollItem: React.FC<PollItemProps> = ({ poll }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp, 10) * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <li className={styles['polls-list-item']}>
      <Link href={`/polls/${poll.id}`}>
        <div
          className={`${styles['poll-status']} ${
            poll.status === PollStatus.OPEN
              ? styles.live
              : poll.status === PollStatus.NOT_STARTED
                ? styles.notStarted
                : styles.ended
          }`}
        >
          <Image src={Circle} alt='circle' />
          {poll.status === PollStatus.OPEN
            ? 'Live now'
            : poll.status === PollStatus.NOT_STARTED
              ? 'Not Started'
              : 'Ended'}
        </div>
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.heading}>
              <h2>{poll.name} </h2>
              {POLICY_ICONS[poll.policyTrait] && (
                <Image src={POLICY_ICONS[poll.policyTrait] as string} width={26} height={26} alt='icon' />
              )}
            </div>
            <p>{Number(poll.voteOptions)} Candidates</p>
          </div>
          <div className={styles.right}>
            <p>
              <span>Start Time</span>
              <span>:</span>
              <span>{formatDate(poll.startDate)}</span>
            </p>
            <p>
              <span>End Time</span>
              <span>:</span>
              <span>{formatDate(poll.endDate)}</span>
            </p>
          </div>
        </div>
        {poll.status === PollStatus.RESULT_COMPUTED && (
          <Link href={`/poll/${poll.id}`} className={styles.viewButton}>
            <p>View Results</p>
          </Link>
        )}
      </Link>
    </li>
  );
};

export default PollItem;
