import React from 'react';
import { usePolicyFactory } from '@/services/policies/PolicyFactory';
import { PollPolicyType } from '@/types';
import { useAccount } from 'wagmi';
import { useSigContext } from '@/contexts/SigContext';
import { usePoll } from '@/hooks/usePollContext';
import styles from './index.module.css';

interface JoinPollButtonProps {
  policyType: PollPolicyType;
  policyData?: any;
}

/**
 * A policy-driven button component for joining polls
 * Adapts its UI and behavior based on the poll's policy type
 */
export const JoinPollButton: React.FC<JoinPollButtonProps> = ({ policyType, policyData }) => {
  const { address, isConnected } = useAccount();
  const { hasJoinedPoll, onJoinPoll, isLoading: isJoining } = usePoll();
  const { isRegistered, isLoading: isRegistering, onSignup } = useSigContext();

  // Use the policy factory to get the appropriate policy
  const policy = usePolicyFactory(policyType, {
    policyData,
    address,
    isConnected,
    isRegistered: hasJoinedPoll
  });

  // If the user is already registered, show a success message
  if (hasJoinedPoll) {
    return null;
  }

  // Handler for joining the poll
  const handleJoinPoll = async () => {
    try {
      if (!policy.canJoin) {
        console.error('You cannot join this poll. Check requirements.');
        return;
      }

      const signupData = await policy.getSignupData();
      await onJoinPoll(signupData);
    } catch (error) {
      console.error('Error joining poll:', error);
    }
  };

  // If user is not connected, show connect wallet button
  if (!isConnected) {
    return (
      <div className={styles.joinButtonWrapper}>
        <div className={styles.walletPrompt}>
          <img src='/icons/wallet-icon.svg' alt='Wallet' className={styles.walletIcon} />
          <p>Connect your wallet to join this poll</p>
          <button className={styles.connectWalletButton} onClick={() => {}}>
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  // If user is not registered, show register button
  if (!isRegistered) {
    return (
      <div className={styles.joinButtonWrapper}>
        <div className={styles.walletPrompt}>
          <img src='/icons/free-icon.svg' alt='Register' className={styles.walletIcon} />
          <p>Registration required to join polls</p>
          <button className={styles.connectWalletButton} onClick={onSignup} disabled={isRegistering}>
            {isRegistering ? (
              <>
                <span className={styles.loader}></span>
                Registering...
              </>
            ) : (
              'Register with Privote'
            )}
          </button>
        </div>
      </div>
    );
  }
  // Render the policy-specific UI component
  const PolicyComponent = policy.PolicyComponent;

  return (
    <div className={styles.joinButtonWrapper}>
      {policy.requirementsDescription && (
        <div className={styles.eligibilityStatus + ' ' + (policy.canJoin ? styles.eligible : styles.notEligible)}>
          {policy.canJoin ? (
            <img src='/icons/check-icon.svg' alt='Eligible' className={styles.statusIcon} />
          ) : (
            <img src='/icons/error-icon.svg' alt='Not Eligible' className={styles.statusIcon} />
          )}
          <span>{policy.requirementsDescription}</span>
        </div>
      )}

      {/* Render the policy-specific UI component in a styled container */}
      <div className={styles.policyComponent}>
        <PolicyComponent />
      </div>

      {/* Show join button only if the user can join */}
      {policy.canJoin && (
        <button onClick={handleJoinPoll} disabled={isJoining || policy.isLoading} className={styles.joinButton}>
          {isJoining || policy.isLoading ? (
            <>
              <span className={styles.loader}></span>
              <span>Joining Poll...</span>
            </>
          ) : (
            <>
              <img src='/icons/join-icon.svg' alt='Join' width='16' height='16' />
              <span>Join Poll</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
