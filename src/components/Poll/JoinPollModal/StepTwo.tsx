'use client';
import {
  AnonAadhaarPolicy,
  EASPolicy,
  ERC20Policy,
  ERC20VotesPolicy,
  FreeForAllPolicy,
  GitcoinPolicy,
  SemaphorePolicy,
  TokenPolicy
} from '@/services/policies';
import { PollPolicyType } from '@/types';
import React from 'react';
import { Hex } from 'viem';
import { ISignupState } from './JoinPollModal';

interface StepTwoProps {
  signupState: ISignupState;
  setSignupState: React.Dispatch<React.SetStateAction<ISignupState>>;
  policyType: PollPolicyType;
  policyData?: Hex;
  onNext: () => void;
  onBack: () => void;
}

export const StepTwo: React.FC<StepTwoProps> = ({
  policyData,
  signupState,
  setSignupState,
  policyType,
  onNext,
  onBack
}) => {
  return (
    <>
      {policyType === PollPolicyType.AnonAadhaar && (
        <AnonAadhaarPolicy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {policyType === PollPolicyType.EAS && (
        <EASPolicy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {policyType === PollPolicyType.ERC20 && (
        <ERC20Policy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {policyType === PollPolicyType.ERC20Votes && (
        <ERC20VotesPolicy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {policyType === PollPolicyType.GitcoinPassport && (
        <GitcoinPolicy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {policyType === PollPolicyType.FreeForAll && (
        <FreeForAllPolicy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {policyType === PollPolicyType.Semaphore && (
        <SemaphorePolicy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {policyType === PollPolicyType.Token && (
        <TokenPolicy
          policyData={policyData}
          signupState={signupState}
          setSignupState={setSignupState}
          onNext={onNext}
          onBack={onBack}
        />
      )}
    </>
  );
};
