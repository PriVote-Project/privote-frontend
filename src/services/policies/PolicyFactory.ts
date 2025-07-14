import { PollPolicyType } from '@/types'
import { useFreeForAllPolicy } from './FreeForAllPolicy'
import { useAnonAadhaarPolicy } from './AnonAadhaarPolicy'
import { useERC20Policy } from './ERC20Policy'
import { useTokenPolicy } from './TokenPolicy'
import { PolicyHookProps, PolicyHookResult } from './types'
import { useMemo } from 'react'

/**
 * PolicyFactory hook to get the appropriate policy hook based on policy type
 * 
 * @param policyType The type of policy (FreeForAll, AnonAadhaar, etc.)
 * @param props Props required by all policy hooks
 * @returns The appropriate policy hook result with methods and UI components
 */
export const usePolicyFactory = (
  policyType: PollPolicyType, 
  props: PolicyHookProps
): PolicyHookResult => {
  const freeForAllPolicy = useFreeForAllPolicy(props)
  const anonAadhaarPolicy = useAnonAadhaarPolicy(props)
  const erc20Policy = useERC20Policy(props)
  const tokenPolicy = useTokenPolicy(props)

  // Use memo to avoid unnecessary re-renders
  const policyHook = useMemo(() => {
    switch (policyType) {
      case PollPolicyType.AnonAadhaar:
        return anonAadhaarPolicy
      case PollPolicyType.ERC20:
        return erc20Policy
      case PollPolicyType.Token:
        return tokenPolicy
      case PollPolicyType.FreeForAll:
      default:
        return freeForAllPolicy
    }
  }, [policyType, freeForAllPolicy, anonAadhaarPolicy, erc20Policy, tokenPolicy])

  return policyHook
}
