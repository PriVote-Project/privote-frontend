'use client';
import { supportedChains } from '@/config/chains';
import { type ChainConstants, appConstants } from '@/config/constants';
import { SUBGRAPH_VERSION } from '@/utils/constants';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useChainId } from 'wagmi';

export interface IAppConstantsContext extends ChainConstants {
  isChainSupported: boolean;
  subgraphUrl: string;
  shadowChain: number;
  updateChain: (chainId: number) => void;
}

export const AppConstantsContext = createContext<IAppConstantsContext | null>(null);

const AppConstantsProvider = ({ children }: { children: React.ReactNode }) => {
  const currentChainId = useChainId();
  const [shadowChain, setShadowChain] = useState(currentChainId);

  const constants = useMemo(() => {
    const effectiveChainId = shadowChain ?? supportedChains[0].id;
    return (
      appConstants[effectiveChainId as (typeof supportedChains)[number]['id']] ?? appConstants[supportedChains[0].id]
    );
  }, [shadowChain]);

  const subgraphUrl = useMemo(() => {
    // Validate environment variables
    if (!constants.subgraphProjectId || !SUBGRAPH_VERSION) {
      console.error('Missing subgraph environment variables:', {
        subgraphProjectId: constants.subgraphProjectId ? 'set' : 'missing',
        SUBGRAPH_VERSION: SUBGRAPH_VERSION ? 'set' : 'missing'
      });
      // Return a fallback or throw an error
      throw new Error('Subgraph configuration is incomplete. Please check environment variables.');
    }

    return `https://api.goldsky.com/api/public/${constants.subgraphProjectId}/subgraphs/privote-${constants.slugs.subgraph}/${SUBGRAPH_VERSION}/gn`;
  }, [constants.subgraphProjectId, constants.slugs.subgraph]);

  const isChainSupported = supportedChains.some(chain => chain.id === shadowChain);

  const updateChain = (chainId: number) => {
    if (supportedChains.some(chain => chain.id === chainId)) {
      setShadowChain(chainId);
    }
  };

  useEffect(() => {
    if (shadowChain !== currentChainId) setShadowChain(currentChainId);
  }, [currentChainId]);

  return (
    <AppConstantsContext.Provider value={{ ...constants, isChainSupported, shadowChain, subgraphUrl, updateChain }}>
      {children}
    </AppConstantsContext.Provider>
  );
};

export default AppConstantsProvider;
