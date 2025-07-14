import { useState } from 'react'
import { PolicyHookProps, PolicyHookResult } from './types'

/**
 * FreeForAll Policy Component (Empty as no special UI is needed)
 */
const FreeForAllComponent: React.FC = () => {
  return null
}

/**
 * Hook for handling FreeForAll policy
 * @param props Policy hook props
 * @returns Policy hook result with methods and components
 */
export const useFreeForAllPolicy = (props: PolicyHookProps): PolicyHookResult => {
  const { isConnected, isRegistered } = props
  const [isLoading, setIsLoading] = useState(false)
  
  // Anyone can join if connected and not already registered
  const canJoin = isConnected && !isRegistered
  
  // FreeForAll doesn't need any special signup data
  const getSignupData = async (): Promise<string> => {
    return '0x'
  }
  
  return {
    canJoin,
    getSignupData,
    PolicyComponent: FreeForAllComponent,
    requirementsDescription: 'Anyone can join this poll',
    isLoading
  }
}
