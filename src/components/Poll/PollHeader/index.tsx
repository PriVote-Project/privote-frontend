import { Modal, ShareModal } from '@/components/shared';
import { usePollContext } from '@/hooks/usePollContext';
import { PollStatus } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaShare } from 'react-icons/fa';
import { JoinPollButton } from '../JoinPollButton';
import styles from './index.module.css';

function formatTimeRemaining(time: number) {
  if (time <= 0) return '00:00:00';

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return time > 86400
    ? `${Math.floor(time / 86400)} days`
    : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const PollHeader = () => {
  const { poll } = usePollContext();
  const {
    status,
    policyTrait: pollPolicyType,
    policyData,
    description: pollDescription,
    name: pollName,
    startDate: pollStartTime,
    endDate: pollEndTime
  } = poll!;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    status === PollStatus.OPEN
      ? Number(pollEndTime) - Date.now() / 1000
      : status === PollStatus.NOT_STARTED
        ? Number(pollStartTime) - Date.now() / 1000
        : 0
  );

  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleCloseInstructionsModal = () => {
    setIsInstructionsModalOpen(false);
  };

  useEffect(() => {
    if (status !== PollStatus.CLOSED && status !== PollStatus.RESULT_COMPUTED) {
      const timer = setInterval(() => {
        const newTime =
          status === PollStatus.OPEN
            ? Number(pollEndTime) - Date.now() / 1000
            : Number(pollStartTime) - Date.now() / 1000;
        setTimeRemaining(newTime);

        if (newTime <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, pollStartTime, pollEndTime]);

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Link href={'/polls'} className={styles.back}>
          <Image src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
        </Link>

        <div className={styles.end}>
          <div className={styles.headerButtons}>
            <button className={styles.shareButton} onClick={handleOpenShareModal}>
              <FaShare /> Share
            </button>
          </div>

          {(status === PollStatus.OPEN || status === PollStatus.NOT_STARTED) && (
            <JoinPollButton policyType={pollPolicyType} policyData={policyData} />
          )}

          {/* Modals */}
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={handleCloseShareModal}
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={pollName}
            description={pollDescription}
          />

          <Modal isOpen={isInstructionsModalOpen} onClose={handleCloseInstructionsModal} title='Instructions'>
            <div className={styles.instructions}>
              <p>Follow the instructions to vote on this poll.</p>
            </div>
          </Modal>

          <div className={styles.status}>
            <Image src='/clock.svg' alt='clock' width={24} height={24} />
            {(status === PollStatus.CLOSED || status === PollStatus.RESULT_COMPUTED) && 'Poll ended'}
            {status === PollStatus.OPEN &&
              (timeRemaining <= 0 ? (
                'Poll ended'
              ) : (
                <span className={styles.timeInfo}>Time left: {formatTimeRemaining(timeRemaining)}</span>
              ))}
            {status === PollStatus.NOT_STARTED && (
              <span className={styles.timeInfo}>Starts in: {formatTimeRemaining(timeRemaining)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollHeader;
