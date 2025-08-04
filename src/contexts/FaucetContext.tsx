'use client';
import { FaucetModal } from '@/components/shared';
import { supportedChains } from '@/config/chains';
import { notification } from '@/utils/notification';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { IFaucetContext } from './types';

export const FaucetContext = createContext<IFaucetContext | null>(null);

const MIN_BALANCE = 0;

const FaucetProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address, chainId, query: { enabled: !!address && !!chainId } });
  const [showFaucetModal, setShowFaucetModal] = useState(false);

  const memoizedBalance = useMemo(() => {
    if (balance) {
      return balance.value;
    }
  }, [balance]);

  const checkBalance = () => {
    if (!address) {
      notification.error('Please connect your wallet');
      return true;
    }
    const isSupportedChain = supportedChains.some(c => c.id === chainId);

    if (!isSupportedChain) {
      notification.error('Please connect to a supported network');
      setShowFaucetModal(false);
      return true;
    }

    if (memoizedBalance != undefined && Number(memoizedBalance) <= MIN_BALANCE) {
      notification.error('Insufficient balance');
      setShowFaucetModal(true);

      return true;
    }

    return false;
  };

  useEffect(() => {
    if (memoizedBalance !== undefined && Number(memoizedBalance) > MIN_BALANCE) {
      setShowFaucetModal(false);
    }
  }, [memoizedBalance]);

  return (
    <FaucetContext.Provider value={{ checkBalance }}>
      {children}
      <FaucetModal isOpen={showFaucetModal} onClose={() => setShowFaucetModal(false)} />
    </FaucetContext.Provider>
  );
};

export default FaucetProvider;
