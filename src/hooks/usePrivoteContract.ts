'use client';
import { useAccount } from 'wagmi';
import deployedContracts from '@/contracts/deployedContracts';

const usePrivoteContract = () => {
  const { isConnected, chainId } = useAccount();

  return isConnected && chainId ? deployedContracts[chainId as keyof typeof deployedContracts]?.privote || null : null;
};

export default usePrivoteContract;
