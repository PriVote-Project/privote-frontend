import { usePollContext } from '@/hooks/usePollContext';
import { PollPolicyType } from '@/types';
import React, { useState } from 'react';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { JoinPollModal } from '../JoinPollModal';
import styles from './index.module.css';

interface JoinPollButtonProps {
  policyType: PollPolicyType;
  policyData?: Hex;
}

/**
 * A simplified button component for joining polls that opens a step-by-step modal
 */
export const JoinPollButton: React.FC<JoinPollButtonProps> = ({ policyType, policyData }) => {
  const { isConnected } = useAccount();
  const { hasJoinedPoll } = usePollContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // If the user has already joined the poll, don't show the button
  if (hasJoinedPoll) {
    return null;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // If user is not connected, show connect wallet prompt
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

  // Main join button - opens the step modal
  return (
    <div className={styles.joinButtonWrapper}>
      <button onClick={handleOpenModal} className={styles.joinButton}>
        <img src='/icons/join-icon.svg' alt='Join' width='16' height='16' />
        <span>Join Poll</span>
      </button>

      {/* Step-by-step modal */}
      <JoinPollModal isOpen={isModalOpen} onClose={handleCloseModal} policyType={policyType} policyData={policyData} />
    </div>
  );
};
