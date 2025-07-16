import useDecodeService from '@/hooks/useDecodeService';
import { ERC20PolicyData } from '@/services/decode/types';
import { PollPolicyType } from '@/types';
import { DEFAULT_SG_DATA } from '@/utils/constants';
import { useCallback, useState } from 'react';
import { formatEther } from 'viem';
import { useBalance } from 'wagmi';
import styles from '../styles.module.css';
import { PolicyHookProps, PolicyHookResult } from '../types';

/**
 * Hook for handling ERC20 policy
 * Allows users to join if they have a minimum balance of the specified ERC20 token
 *
 * @param props Policy hook props
 * @returns Policy hook result with methods and components
 */
export const useERC20Policy = (props: PolicyHookProps): PolicyHookResult => {
  const { isConnected, isRegistered, policyData, address } = props;
  const [isLoading, setIsLoading] = useState(false);

  // Extract token address and threshold from policyData
  const decodedPolicyData = useDecodeService<ERC20PolicyData>(PollPolicyType.ERC20, policyData);
  const tokenAddress = decodedPolicyData?.token?.address || '0x';
  const threshold = decodedPolicyData?.threshold ? parseFloat(formatEther(decodedPolicyData.threshold)) : 0;

  // Get user's token balance
  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
    token: tokenAddress !== '0x' ? (tokenAddress as `0x${string}`) : undefined,
    query: {
      enabled: !!address && !!tokenAddress && tokenAddress !== '0x'
    }
  });

  const userBalance = balanceData ? parseFloat(formatEther(balanceData.value)) : 0;

  // User can join if connected, not registered, and has enough token balance
  const canJoin = isConnected && !isRegistered && userBalance >= threshold && tokenAddress !== '0x';

  /**
   * Get signup data for ERC20 policy (empty since we don't need additional data)
   */
  const getSignupData = async (): Promise<string> => {
    setIsLoading(true);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      if (isRegistered) {
        throw new Error('Already registered');
      }

      if (!tokenAddress || tokenAddress === '0x') {
        throw new Error('Invalid token address');
      }

      if (userBalance < threshold) {
        throw new Error(`Insufficient token balance. You need at least ${threshold} tokens`);
      }

      // For ERC20 policy, we just use the default signup data
      return DEFAULT_SG_DATA;
    } catch (error) {
      console.error('Error generating ERC20 policy signup data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ERC20 Policy UI Component
   */
  const ERC20PolicyComponent: React.FC = useCallback(() => {
    if (!isConnected) {
      return <div className={styles.errorMessage}>Please connect your wallet to check token balance</div>;
    }

    return (
      <>
        <div className={styles.policyHeader}>
          <div className={styles.policyIconWrapper}>
            <img src='/icons/token-icon.svg' alt='ERC20' className={styles.policyIcon} />
          </div>
          <div className={styles.policyTitle}>
            <h4>Token-Based Access</h4>
            <span className={styles.policySubtitle}>ERC20 Token Required</span>
          </div>
        </div>

        <div className={styles.policyDetails}>
          {decodedPolicyData?.token?.name && (
            <div className={styles.policyDetailRow}>
              <span className={styles.detailLabel}>Token:</span>
              <span className={styles.detailValue}>
                {decodedPolicyData.token.name}{' '}
                {decodedPolicyData.token?.symbol && `(${decodedPolicyData.token.symbol})`}
              </span>
            </div>
          )}
          <div className={styles.policyDetailRow}>
            <span className={styles.detailLabel}>Contract:</span>
            <span className={styles.detailValue}>
              <span className={styles.addressText}>{tokenAddress}</span>
            </span>
          </div>
          {decodedPolicyData?.threshold && (
            <div className={styles.policyDetailRow}>
              <span className={styles.detailLabel}>Required:</span>
              <span className={styles.detailValue}>
                <span className={styles.highlight}>
                  {formatEther(decodedPolicyData.threshold)} {decodedPolicyData.token?.symbol || 'tokens'}
                </span>{' '}
                minimum
              </span>
            </div>
          )}
        </div>

        {/* Balance Information */}
        <div className={styles.balanceInfo}>
          <span className={styles.balanceLabel}>Your Balance:</span>
          <span className={styles.balanceValue}>
            {userBalance.toLocaleString()} {decodedPolicyData?.token?.symbol || 'tokens'}
          </span>
        </div>

        {/* Balance Status */}
        <div
          className={`${styles.balanceStatus} ${userBalance >= threshold ? styles.sufficient : styles.insufficient}`}
        >
          {userBalance >= threshold ? (
            <>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none' style={{ marginRight: '8px' }}>
                <path
                  d='M13.5 4.5L6 12L2.5 8.5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              You meet the minimum balance requirement
            </>
          ) : (
            <>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none' style={{ marginRight: '8px' }}>
                <path
                  d='M15 5L5 15M5 5L15 15'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Insufficient balance. You need {(threshold - userBalance).toLocaleString()} more tokens
            </>
          )}
        </div>
      </>
    );
  }, [isConnected, userBalance, decodedPolicyData, tokenAddress, threshold]);

  return {
    canJoin,
    getSignupData,
    isLoading,
    PolicyComponent: ERC20PolicyComponent,
    requirementsDescription: `This poll requires you to have at least ${threshold} tokens at ${tokenAddress}`
  };
};
