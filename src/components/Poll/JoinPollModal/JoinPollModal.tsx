'use client';
import { Modal } from '@/components/shared';
import { useSigContext } from '@/contexts/SigContext';
import { usePoll } from '@/hooks/usePollContext';
import { PollPolicyType } from '@/types';
import { notification } from '@/utils/notification';
import React, { useCallback, useState } from 'react';
import { Hex } from 'viem';
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

export interface ISignupState {
  canJoin: boolean;
  data: Hex;
}

export const JoinPollModal: React.FC<JoinPollModalProps> = ({ isOpen, onClose, policyType, policyData }) => {
  const [signupState, setSignupState] = useState<ISignupState>({
    canJoin: false,
    data: '0x'
  });
  const { isRegistered, isLoading: isRegistering, onSignup } = useSigContext();
  const { onJoinPoll, isLoading: isJoining } = usePoll();

  const [currentStep, setCurrentStep] = useState(1);

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
      if (!signupState.canJoin) {
        notification.error('You cannot join this poll');
        return;
      }
      await onJoinPoll(signupState.data);
      onClose();
    } catch (error) {
      console.error('Error joining poll:', error);
    }
  }, [signupState, onJoinPoll, onClose]);

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
            <StepTwo
              policyType={policyType}
              policyData={policyData}
              signupState={signupState}
              setSignupState={setSignupState}
              onNext={handleNext}
              onBack={handleBack}
            />
          ) : currentStep === 3 ? (
            <StepThree
              signupState={signupState}
              isLoading={isJoining}
              onJoinPoll={handleJoinPoll}
              onBack={handleBack}
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default JoinPollModal;
