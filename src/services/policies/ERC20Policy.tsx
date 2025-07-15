import { useCallback, useState } from 'react';
import { formatEther, parseEther } from 'viem';
import { useBalance } from 'wagmi';
import { PolicyHookProps, PolicyHookResult } from './types';
import { DEFAULT_SG_DATA } from '@/utils/constants';
import { ERC20PolicyData } from '../decode/types';
import styles from './styles.module.css';

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
  const tokenAddress = policyData?.token?.address || '0x';
  const threshold = policyData?.threshold ? parseFloat(formatEther(policyData.threshold)) : 0;

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
    return (
      <div>
        {balanceData && (
          <div>
            <p>
              Required Balance: {threshold} {balanceData.symbol}
            </p>
            <p>
              Your Balance: {userBalance} {balanceData.symbol}
            </p>
            {userBalance < threshold ? (
              <p style={{ color: 'red' }}>Insufficient balance to join this poll</p>
            ) : (
              <p style={{ color: 'green' }}>You have sufficient balance to join</p>
            )}
          </div>
        )}
      </div>
    );
  }, [balanceData, threshold, userBalance]);

  return {
    canJoin,
    getSignupData,
    isLoading,
    PolicyComponent: ERC20PolicyComponent,
    requirementsDescription: `This poll requires you to have at least ${threshold} tokens at ${tokenAddress}`
  };
};
