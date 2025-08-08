'use client';
import { useSigContext } from '@/contexts/SigContext';
import usePollContext from '@/hooks/usePollContext';
import React, { useState } from 'react';
import styles from './JoinPollModal.module.css';

interface StepOneProps {
  onNext: () => void;
}

export const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  const { 
    isRegistered, 
    isLoading, 
    onSignup, 
    maciKeypair, 
    deleteKeypair,
    isPollMode,
    currentPollId,
    generatePollKeypair
  } = useSigContext();
  
  const { poll } = usePollContext();
  const [isGeneratingKeypair, setIsGeneratingKeypair] = useState(false);

  const handleSignup = async () => {
    try {
      await onSignup();
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleGeneratePollKeypair = async () => {
    if (!poll || !currentPollId) {
      console.error('Missing poll data or poll ID');
      return;
    }
    
    setIsGeneratingKeypair(true);
    try {
      const pollEndDate = new Date(parseInt(poll.endDate) * 1000).toISOString();
      console.log('Starting poll keypair generation for poll:', currentPollId);
      
      const keypair = await generatePollKeypair(currentPollId, pollEndDate);
      
      if (!keypair) {
        console.error('Poll keypair generation returned null');
        // Could add notification here if needed
      } else {
        console.log('Poll keypair generated successfully');
      }
    } catch (error) {
      console.error('Error generating poll keypair:', error);
      // Could add notification here if needed
    } finally {
      setIsGeneratingKeypair(false);
    }
  };

  // Determine what action button to show
  const needsPollKeypair = isPollMode && !maciKeypair;
  const needsRegistration = maciKeypair && !isRegistered;
  const isReadyToContinue = isRegistered;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h3 className={styles.stepTitle}>
          {isPollMode ? 'Prepare for Poll' : 'Register with Privote'}
        </h3>
        <p className={styles.stepDescription}>
          {isPollMode 
            ? 'To participate in this poll, you need a poll-specific keypair and registration with Privote. This ensures your votes are private and unique to this poll.'
            : 'To participate in polls, you need to register with Privote. This creates your anonymous identity on the platform.'
          }
        </p>
      </div>

      <div className={styles.stepBody}>
        {/* Poll Keypair Status */}
        {isPollMode && (
          <div className={`${styles.registrationStatus} ${maciKeypair ? styles.registered : styles.notRegistered}`}>
            <div className={`${styles.statusIcon} ${maciKeypair ? styles.success : styles.pending}`}>
              {maciKeypair ? (
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path
                    d='M13.5 4.5L6 12L2.5 8.5'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <circle cx='8' cy='8' r='7' stroke='currentColor' strokeWidth='2' fill='none' />
                  <path d='M8 5v3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                  <circle cx='8' cy='11' r='1' fill='currentColor' />
                </svg>
              )}
            </div>
            <div className={styles.statusText}>
              {maciKeypair ? "Poll keypair generated!" : 'Poll-specific keypair required'}
            </div>
          </div>
        )}

        {/* Registration Status */}
        <div className={`${styles.registrationStatus} ${isRegistered ? styles.registered : styles.notRegistered}`}>
          <div className={`${styles.statusIcon} ${isRegistered ? styles.success : maciKeypair ? styles.pending : styles.disabled}`}>
            {isRegistered ? (
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M13.5 4.5L6 12L2.5 8.5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <circle cx='8' cy='8' r='7' stroke='currentColor' strokeWidth='2' fill='none' />
                <path d='M8 5v3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                <circle cx='8' cy='11' r='1' fill='currentColor' />
              </svg>
            )}
          </div>
          <div className={styles.statusText}>
            {isRegistered ? "You're registered on Privote!" : 'Registration required to join polls'}
          </div>
        </div>

        {/* Show different info based on current state */}
        {needsPollKeypair ? (
          <div className={styles.registrationInfo}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
              What is a poll-specific keypair?
            </h4>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>A unique cryptographic keypair just for this poll</li>
              <li>Generated from your signature and stored securely until poll ends</li>
              <li>Allows you to vote and change your vote during the poll period</li>
              <li>Automatically expires when the poll closes</li>
            </ul>
          </div>
        ) : needsRegistration ? (
          <div className={styles.registrationInfo}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
              What happens during registration?
            </h4>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>Your poll keypair is registered on the blockchain anonymously</li>
              <li>You&apos;ll be able to join and vote in this poll privately</li>
              <li>Your voting history remains completely anonymous</li>
              <li>Your identity is cryptographically protected</li>
            </ul>
          </div>
        ) : !isRegistered && !isPollMode ? (
          <div className={styles.registrationInfo}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
              What happens during registration?
            </h4>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li>A unique cryptographic keypair is generated for you</li>
              <li>Your identity is registered on the blockchain anonymously</li>
              <li>You&apos;ll be able to join and vote in polls privately</li>
              <li>Your voting history remains completely anonymous</li>
            </ul>
          </div>
        ) : null}

        {/* Keypair management section */}
        {maciKeypair && (
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: '16px'
            }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
              Keypair Management
            </h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', marginBottom: '12px' }}>
              If you&apos;re experiencing issues or want to generate a new keypair, you can delete your current one.
            </p>
            <button
              onClick={deleteKeypair}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                border: '1px solid rgba(235, 87, 87, 0.3)',
                backgroundColor: 'rgba(235, 87, 87, 0.1)',
                color: '#eb5757',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = 'rgba(235, 87, 87, 0.2)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'rgba(235, 87, 87, 0.1)';
              }}
            >
              Delete Keypair
            </button>
          </div>
        )}
      </div>

      <div className={styles.stepFooter}>
        <div></div> {/* Empty div for spacing */}
        
        {/* Show Continue button if registered */}
        {isReadyToContinue ? (
          <button className={`${styles.button} ${styles.successButton}`} onClick={onNext}>
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
          </button>
        ) : needsPollKeypair ? (
          /* Show Generate Poll Keypair button if in poll mode and no keypair */
          <button 
            className={`${styles.button} ${styles.primaryButton}`} 
            onClick={handleGeneratePollKeypair} 
            disabled={isGeneratingKeypair}
          >
            {isGeneratingKeypair ? (
              <>
                <div className={styles.loader}></div>
                Generating Poll Keypair...
              </>
            ) : (
              <>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 1V15M1 8H15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                </svg>
                Generate Poll Keypair
              </>
            )}
          </button>
        ) : needsRegistration ? (
          /* Show Register button if have keypair but not registered */
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleSignup} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className={styles.loader}></div>
                Registering...
              </>
            ) : (
              <>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 1V15M1 8H15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                </svg>
                Register with Privote
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
};
