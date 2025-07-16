import { useCallback, useState } from 'react';
import styles from '../styles.module.css';
import { PolicyHookProps, PolicyHookResult } from '../types';

/**
 * FreeForAll Policy Component
 */
const FreeForAllComponent: React.FC = () => {
  return (
    <>
      <div className={styles.policyHeader}>
        <div className={styles.policyIconWrapper}>
          <img src='/icons/free-icon.svg' alt='Free' className={styles.policyIcon} />
        </div>
        <div className={styles.policyTitle}>
          <h4>Open Access Poll</h4>
          <span className={styles.policySubtitle}>No Special Requirements</span>
        </div>
      </div>

      <div className={styles.policyDetails}>
        <div className={styles.policyDetailRow}>
          <span className={styles.detailLabel}>Access Level:</span>
          <span className={styles.detailValue}>
            <span className={styles.highlight}>Public</span>
          </span>
        </div>
        <div className={styles.policyDetailRow}>
          <span className={styles.detailLabel}>Requirements:</span>
          <span className={styles.detailValue}>Connected wallet only</span>
        </div>
        <div className={styles.policyDetailRow}>
          <span className={styles.detailLabel}>Eligibility:</span>
          <span className={styles.detailValue}>All registered users</span>
        </div>
      </div>

      <div className={styles.freeForAllDescription}>
        <svg width='20' height='20' viewBox='0 0 20 20' fill='none' style={{ marginRight: '8px' }}>
          <path
            d='M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
            stroke='currentColor'
            strokeWidth='2'
          />
          <path
            d='M7 10L9 12L13 8'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        This is an open poll where anyone with a registered Privote account can participate. No additional tokens, NFTs,
        or verification is required.
      </div>
    </>
  );
};

/**
 * Hook for handling FreeForAll policy
 * @param props Policy hook props
 * @returns Policy hook result with methods and components
 */
export const useFreeForAllPolicy = (props: PolicyHookProps): PolicyHookResult => {
  const { isConnected, isRegistered } = props;
  const [isLoading] = useState(false);

  // Anyone can join if connected and not already registered
  const canJoin = isConnected && !isRegistered;

  // FreeForAll doesn't need any special signup data
  const getSignupData = async (): Promise<string> => {
    return '0x';
  };

  // Memoized component to prevent unnecessary re-renders
  const PolicyComponent: React.FC = useCallback(() => {
    return <FreeForAllComponent />;
  }, []);

  return {
    canJoin,
    getSignupData,
    PolicyComponent,
    requirementsDescription: 'This is an open poll - anyone with a registered Privote account can participate',
    isLoading
  };
};
