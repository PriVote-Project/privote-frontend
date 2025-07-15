'use client';
import deployedContracts from '@/contracts/deployedContracts';
import { useAccount } from 'wagmi';

const usePrivoteContract = () => {
  const { isConnected, chainId } = useAccount();

  return isConnected && chainId ? deployedContracts[chainId as keyof typeof deployedContracts]?.privote || null : null;
};

export default usePrivoteContract;
