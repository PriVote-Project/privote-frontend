import { useAnonAadhaarPolicy } from '@/services/policies/AnonAadhaarPolicy';
import { useFreeForAllPolicy } from '@/services/policies/FreeForAllPolicy';
import { PolicyHookProps, PolicyHookResult } from '@/services/policies/types';
import { PollPolicyType } from '@/types';

/**
 * Factory hook that returns the appropriate policy hook based on policy type
 * @param policyType The type of policy to use
 * @param props Common props for all policy hooks
 * @returns The appropriate policy hook result
 */
export const usePolicyFactory = (policyType: PollPolicyType, props: PolicyHookProps): PolicyHookResult => {
  // Default policy is FreeForAll
  let policyHook: PolicyHookResult = useFreeForAllPolicy(props);

  // Select the appropriate policy hook based on policy type
  switch (policyType) {
    case PollPolicyType.AnonAadhaar:
      policyHook = useAnonAadhaarPolicy(props);
      break;
    case PollPolicyType.FreeForAll:
    default:
      policyHook = useFreeForAllPolicy(props);
      break;
    // Additional policy types will be added here
  }

  return policyHook;
};
