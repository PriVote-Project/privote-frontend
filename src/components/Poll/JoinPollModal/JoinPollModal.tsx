'use client';
import { Modal } from '@/components/shared';
import { useSigContext } from '@/contexts/SigContext';
import { usePoll } from '@/hooks/usePollContext';
import { usePolicyFactory } from '@/services/policies/PolicyFactory';
import { PollPolicyType } from '@/types';
import React, { useCallback, useState } from 'react';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';
import styles from './JoinPollModal.module.css';
import { StepOne } from './StepOne';
import { StepThree } from './StepThree';
import { StepTwo } from './StepTwo';

interface JoinPollModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: PollPolicyType;
  policyData?: Hex;
}

export const JoinPollModal: React.FC<JoinPollModalProps> = ({ isOpen, onClose, policyType, policyData }) => {
  const { address, isConnected } = useAccount();
  const { isRegistered, isLoading: isRegistering, onSignup } = useSigContext();
  const { hasJoinedPoll, onJoinPoll, isLoading: isJoining } = usePoll();

  const [currentStep, setCurrentStep] = useState(1);

  // Get the policy for this poll
  const policy = usePolicyFactory(policyType, {
    policyData,
    address,
    isConnected,
    isRegistered: hasJoinedPoll
  });

  // Reset step when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleJoinPoll = useCallback(async () => {
    try {
      const signupData = await policy.getSignupData();
      console.log(signupData);
      await onJoinPoll(signupData);
      onClose();
    } catch (error) {
      console.error('Error joining poll:', error);
    }
  }, [policy, onJoinPoll, onClose]);

  const getStepStatus = (step: number) => {
    if (step === 1) {
      return isRegistered ? 'completed' : currentStep === 1 ? 'active' : 'pending';
    }
    if (step === 2) {
      return !isRegistered ? 'pending' : currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending';
    }
    if (step === 3) {
      return currentStep === 3 ? 'active' : 'pending';
    }
    return 'pending';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Join Poll' maxWidth='600px' showCloseButton={true}>
      <div className={styles.modalContent}>
        {/* Step Progress Indicator */}
        <div className={styles.stepIndicator}>
          <div className={styles.stepProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${((currentStep - 1) / 2) * 100}%` }} />
            </div>
            {[1, 2, 3].map(step => (
              <div key={step} className={`${styles.stepCircle} ${styles[getStepStatus(step)]}`}>
                {getStepStatus(step) === 'completed' ? (
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
                  <span>{step}</span>
                )}
              </div>
            ))}
          </div>
          <div className={styles.stepLabels}>
            <span className={currentStep === 1 ? styles.activeLabel : ''}>Register</span>
            <span className={currentStep === 2 ? styles.activeLabel : ''}>Requirements</span>
            <span className={currentStep === 3 ? styles.activeLabel : ''}>Join Poll</span>
          </div>
        </div>

        {/* Step Content */}
        <div className={styles.stepContent}>
          {currentStep === 1 ? (
            <StepOne isRegistered={isRegistered} isLoading={isRegistering} onSignup={onSignup} onNext={handleNext} />
          ) : currentStep === 2 ? (
            <StepTwo policy={policy} onNext={handleNext} onBack={handleBack} />
          ) : currentStep === 3 ? (
            <StepThree policy={policy} isLoading={isJoining} onJoinPoll={handleJoinPoll} onBack={handleBack} />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default JoinPollModal;
