'use client';
import { PolicyHookResult } from '@/services/policies/types';
import React from 'react';
import styles from './JoinPollModal.module.css';

interface StepThreeProps {
  policy: PolicyHookResult;
  isLoading: boolean;
  onJoinPoll: () => void;
  onBack: () => void;
}

export const StepThree: React.FC<StepThreeProps> = ({ policy, isLoading, onJoinPoll, onBack }) => {
  const { canJoin, requirementsDescription } = policy;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h3 className={styles.stepTitle}>Ready to Join</h3>
        <p className={styles.stepDescription}>
          You're all set! Click the button below to join this poll and start participating.
        </p>
      </div>

      <div className={styles.stepBody}>
        {/* Join Summary */}
        <div className={styles.joinSummary}>
          <h4 className={styles.summaryTitle}>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none' style={{ marginRight: '8px' }}>
              <path
                d='M16.25 6.25L7.5 15L3.75 11.25'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Everything Ready
          </h4>
          <p className={styles.summaryText}>
            You have successfully registered with Privote and meet all the requirements for this poll. Once you join,
            you'll be able to cast your vote anonymously.
          </p>
        </div>

        {/* Final Requirements Check */}
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '20px'
          }}
        >
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M8 1V15M1 8H15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
            </svg>
            Poll Requirements
          </h4>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              margin: 0,
              lineHeight: '1.5'
            }}
          >
            {requirementsDescription}
          </p>
        </div>

        {/* What happens next */}
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(215, 232, 132, 0.1)',
            border: '1px solid rgba(215, 232, 132, 0.2)'
          }}
        >
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#d7e884',
              marginBottom: '12px'
            }}
          >
            What happens when you join?
          </h4>
          <ul
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              lineHeight: '1.6',
              paddingLeft: '20px',
              margin: 0
            }}
          >
            <li>Your participation will be recorded anonymously</li>
            <li>You'll gain voting rights for this specific poll</li>
            <li>Your vote will be completely private and verifiable</li>
            <li>You can cast your vote anytime before the poll ends</li>
          </ul>
        </div>

        {!canJoin && (
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(235, 87, 87, 0.15)',
              border: '1px solid rgba(235, 87, 87, 0.3)',
              color: '#eb5757',
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'center'
            }}
          >
            <strong>Unable to join:</strong> You don't meet the requirements for this poll.
          </div>
        )}
      </div>

      <div className={styles.stepFooter}>
        <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onBack} disabled={isLoading}>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path
              d='M10 12L6 8L10 4'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Back
        </button>

        <button
          className={`${styles.button} ${canJoin ? styles.primaryButton : styles.secondaryButton}`}
          onClick={onJoinPoll}
          disabled={!canJoin || isLoading}
        >
          {isLoading ? (
            <>
              <div className={styles.loader}></div>
              Joining Poll...
            </>
          ) : (
            <>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M8 1V15M1 8H15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
              </svg>
              Join Poll
            </>
          )}
        </button>
      </div>
    </div>
  );
};
