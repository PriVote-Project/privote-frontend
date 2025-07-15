import Link from 'next/link';
import { Hex, formatEther } from 'viem';
import styles from './index.module.css';
import { ShareModal, Modal } from '@/components/shared';
import { PollPolicyType, PollStatus, PollType } from '@/types';
import { usePublicClient } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { FaShare } from 'react-icons/fa';
import { DecodeService } from '@/services/decode';
import { JoinPollButton } from '../JoinPollButton';

interface PollHeaderProps {
  pollName: string;
  policyData?: Hex;
  pollPolicyType: PollPolicyType;
  pollType: PollType;
  pollDescription?: string;
  pollEndTime: bigint;
  pollStartTime: bigint;
  status?: PollStatus;
  isConnected: boolean;
}

function formatTimeRemaining(time: number) {
  if (time <= 0) return '00:00:00';

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return time > 86400
    ? `${Math.floor(time / 86400)} days`
    : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const PollHeader = ({
  pollName,
  policyData,
  pollPolicyType,
  status,
  pollDescription,
  pollEndTime,
  pollStartTime
}: PollHeaderProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(
    status === PollStatus.OPEN
      ? Number(pollEndTime) - Date.now() / 1000
      : status === PollStatus.NOT_STARTED
        ? Number(pollStartTime) - Date.now() / 1000
        : 0
  );

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [decodedPolicyData, setDecodedPolicyData] = useState<any>(null);

  const publicClient = usePublicClient();

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
  }, [status, pollEndTime, pollStartTime]);

  useEffect(() => {
    (async () => {
      if (policyData && publicClient) {
        try {
          const decodeService = new DecodeService(pollPolicyType, policyData, publicClient);
          const decoded = await decodeService.decode();
          setDecodedPolicyData(decoded);
        } catch (error) {
          console.error('Error decoding policy data:', error);
        }
      }
    })();
  }, [policyData, publicClient, pollPolicyType]);

  const PolicyInfo = useCallback(() => {
    if (!decodedPolicyData) return null;

    const getPolicyColor = () => {
      switch (pollPolicyType) {
        case PollPolicyType.ERC20:
          return 'rgba(215, 232, 132, 0.15)'; // Light green
        case PollPolicyType.Token:
          return 'rgba(137, 220, 235, 0.15)'; // Light blue
        case PollPolicyType.AnonAadhaar:
          return 'rgba(236, 165, 235, 0.15)'; // Light purple
        case PollPolicyType.FreeForAll:
          return 'rgba(255, 216, 125, 0.15)'; // Light orange
        default:
          return 'rgba(215, 232, 132, 0.15)';
      }
    };

    const getBorderColor = () => {
      switch (pollPolicyType) {
        case PollPolicyType.ERC20:
          return 'rgba(215, 232, 132, 0.6)'; // Green
        case PollPolicyType.Token:
          return 'rgba(137, 220, 235, 0.6)'; // Blue
        case PollPolicyType.AnonAadhaar:
          return 'rgba(236, 165, 235, 0.6)'; // Purple
        case PollPolicyType.FreeForAll:
          return 'rgba(255, 216, 125, 0.6)'; // Orange
        default:
          return 'rgba(215, 232, 132, 0.6)';
      }
    };

    const getTextColor = () => {
      switch (pollPolicyType) {
        case PollPolicyType.ERC20:
          return '#d7e884'; // Green
        case PollPolicyType.Token:
          return '#89dceb'; // Blue
        case PollPolicyType.AnonAadhaar:
          return '#eca5eb'; // Purple
        case PollPolicyType.FreeForAll:
          return '#ffd87d'; // Orange
        default:
          return '#d7e884';
      }
    };

    const policyStyle = {
      backgroundColor: getPolicyColor(),
      borderColor: getBorderColor(),
      color: getTextColor()
    };

    const renderPolicyContent = () => {
      switch (pollPolicyType) {
        case PollPolicyType.ERC20:
          return (
            <>
              <div className={styles.policyHeader}>
                <div className={styles.policyIconWrapper} style={{ backgroundColor: getBorderColor() }}>
                  <img src='/icons/token-icon.svg' alt='ERC20' className={styles.policyIcon} />
                </div>
                <div className={styles.policyTitle}>
                  <h4>Token-Based Access</h4>
                  <span className={styles.policySubtitle}>ERC20 Token Required</span>
                </div>
              </div>
              <div className={styles.policyDetails}>
                {decodedPolicyData.token?.name && (
                  <div className={styles.policyDetailRow}>
                    <span className={styles.detailLabel}>Token:</span>
                    <span className={styles.detailValue}>
                      {decodedPolicyData.token.name} ({decodedPolicyData.token?.symbol})
                    </span>
                  </div>
                )}
                <div className={styles.policyDetailRow}>
                  <span className={styles.detailLabel}>Contract:</span>
                  <span className={styles.detailValue}>
                    <span className={styles.addressText}>{decodedPolicyData.token?.address}</span>
                  </span>
                </div>
                {decodedPolicyData.threshold && (
                  <div className={styles.policyDetailRow}>
                    <span className={styles.detailLabel}>Requirement:</span>
                    <span className={styles.detailValue}>
                      <span className={styles.highlight}>
                        {formatEther(decodedPolicyData.threshold)} {decodedPolicyData.token?.symbol}
                      </span>{' '}
                      minimum balance
                    </span>
                  </div>
                )}
              </div>
            </>
          );
        case PollPolicyType.Token:
          return (
            <>
              <div className={styles.policyHeader}>
                <div className={styles.policyIconWrapper} style={{ backgroundColor: getBorderColor() }}>
                  <img src='/icons/nft-icon.svg' alt='NFT' className={styles.policyIcon} />
                </div>
                <div className={styles.policyTitle}>
                  <h4>NFT-Based Access</h4>
                  <span className={styles.policySubtitle}>Token Ownership Required</span>
                </div>
              </div>
              <div className={styles.policyDetails}>
                {decodedPolicyData.token?.name && (
                  <div className={styles.policyDetailRow}>
                    <span className={styles.detailLabel}>Collection:</span>
                    <span className={styles.detailValue}>{decodedPolicyData.token.name}</span>
                  </div>
                )}
                <div className={styles.policyDetailRow}>
                  <span className={styles.detailLabel}>Contract:</span>
                  <span className={styles.detailValue}>
                    <span className={styles.addressText}>{decodedPolicyData.token?.address}</span>
                  </span>
                </div>
                <div className={styles.policyDetailRow}>
                  <span className={styles.detailLabel}>Requirement:</span>
                  <span className={styles.detailValue}>
                    Own at least <span className={styles.highlight}>1 token</span> from this collection
                  </span>
                </div>
              </div>
            </>
          );
        case PollPolicyType.AnonAadhaar:
          return (
            <>
              <div className={styles.policyHeader}>
                <div className={styles.policyIconWrapper} style={{ backgroundColor: getBorderColor() }}>
                  <img src='/icons/aadhaar-icon.svg' alt='Aadhaar' className={styles.policyIcon} />
                </div>
                <div className={styles.policyTitle}>
                  <h4>AnonAadhaar Verification</h4>
                  <span className={styles.policySubtitle}>Identity Verification Required</span>
                </div>
              </div>
              <div className={styles.policyDetails}>
                <div className={styles.policyDetailRow}>
                  <span className={styles.detailLabel}>Requirement:</span>
                  <span className={styles.detailValue}>
                    Valid AnonAadhaar <span className={styles.highlight}>proof of identity</span>
                  </span>
                </div>
              </div>
            </>
          );
        case PollPolicyType.FreeForAll:
          return (
            <>
              <div className={styles.policyHeader}>
                <div className={styles.policyIconWrapper} style={{ backgroundColor: getBorderColor() }}>
                  <img src='/icons/free-icon.svg' alt='Free' className={styles.policyIcon} />
                </div>
                <div className={styles.policyTitle}>
                  <h4>Open Access</h4>
                  <span className={styles.policySubtitle}>No Requirements</span>
                </div>
              </div>
              <div className={styles.policyDetails}>
                <div className={styles.policyDetailRow}>
                  <span className={styles.detailValue}>
                    This poll is open to all registered users with a connected wallet.
                  </span>
                </div>
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className={styles.policyInfo} style={policyStyle}>
        {renderPolicyContent()}
      </div>
    );
  }, [pollPolicyType, decodedPolicyData]);

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Link href={'/polls'} className={styles.back}>
          <img src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
        </Link>

        <div className={styles.end}>
          <div className={styles.headerButtons}>
            <button className={styles.shareButton} onClick={handleOpenShareModal}>
              <FaShare /> Share
            </button>
          </div>

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
            <img src='/clock.svg' alt='clock' width={24} height={24} />
            {(status === PollStatus.CLOSED || status === PollStatus.RESULT_COMPUTED) && 'Poll ended'}
            {status === PollStatus.OPEN && (
              <span className={styles.timeInfo}>Time left: {formatTimeRemaining(timeRemaining)}</span>
            )}
            {status === PollStatus.NOT_STARTED && (
              <span className={styles.timeInfo}>Starts in: {formatTimeRemaining(timeRemaining)}</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.policyInfoContainer}>
        {/* Policy Info Display */}
        {decodedPolicyData && <PolicyInfo />}

        {/* Show join poll button only if the poll is open */}
        {status === PollStatus.OPEN && (
          <JoinPollButton policyType={pollPolicyType} policyData={policyData ? { ...decodedPolicyData } : undefined} />
        )}
      </div>
    </div>
  );
};

export default PollHeader;
