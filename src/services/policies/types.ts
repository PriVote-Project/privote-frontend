import { ReactNode } from 'react';
import { Hex } from 'viem';
import { PollPolicyType } from '@/types';

/**
 * Common interface for policy hook results
 */
export interface PolicyHookResult {
  /**
   * Whether the user can join the poll based on the policy requirements
   */
  canJoin: boolean;

  /**
   * Function to get the signup data required by the policy
   */
  getSignupData: () => Promise<string>;

  /**
   * UI component to render for the policy (login buttons, etc.)
   */
  PolicyComponent: React.FC;

  /**
   * Message explaining the requirements to join
   */
  requirementsDescription: string;

  /**
   * Loading state for async policy checks
   */
  isLoading: boolean;
}

/**
 * Common props for all policy hooks
 */
export interface PolicyHookProps {
  policyData?: any;
  address?: `0x${string}`;
  isConnected: boolean;
  isRegistered: boolean;
}
