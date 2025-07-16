'use client';
import { PolicyHookResult } from '@/services/policies/types';
import React from 'react';
import styles from './JoinPollModal.module.css';

interface StepTwoProps {
  policy: PolicyHookResult;
  onNext: () => void;
  onBack: () => void;
}

export const StepTwo: React.FC<StepTwoProps> = ({ policy, onNext, onBack }) => {
  const { canJoin, PolicyComponent, requirementsDescription, isLoading } = policy;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h3 className={styles.stepTitle}>Poll Requirements</h3>
        <p className={styles.stepDescription}>
          Review the requirements for this poll and ensure you meet all criteria before joining.
        </p>
      </div>

      <div className={styles.stepBody}>
        {/* Requirements Description */}
        <div className={styles.requirementsSection}>
          <h4 className={styles.requirementsTitle}>Eligibility Requirements</h4>
          <p className={styles.requirementsText}>{requirementsDescription}</p>
        </div>

        {/* Eligibility Status */}
        <div className={`${styles.eligibilityStatus} ${canJoin ? styles.eligible : styles.notEligible}`}>
          <div className={styles.eligibilityIcon}>
            {canJoin ? (
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path
                  d='M16.25 6.25L7.5 15L3.75 11.25'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path
                  d='M15 5L5 15M5 5L15 15'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </div>
          <span>
            {canJoin ? 'You meet all requirements for this poll' : "You don't meet the requirements for this poll"}
          </span>
        </div>

        {/* Policy-Specific Component */}
        <div className={styles.policyWrapper}>
          <PolicyComponent />
        </div>

        {!canJoin && (
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(235, 87, 87, 0.1)',
              border: '1px solid rgba(235, 87, 87, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          >
            <strong>Unable to join:</strong> Please ensure you meet all the requirements listed above before attempting
            to join this poll.
          </div>
        )}
      </div>

      <div className={styles.stepFooter}>
        <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onBack}>
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
          onClick={onNext}
          disabled={!canJoin || isLoading}
        >
          {isLoading ? (
            <>
              <div className={styles.loader}></div>
              Checking...
            </>
          ) : (
            <>
              Continue
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M6 12L10 8L6 4'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
