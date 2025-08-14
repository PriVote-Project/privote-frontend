'use client';
import { supportedChains } from '@/config/chains';
import { type ChainConstants, appConstants } from '@/config/constants';
import { SUBGRAPH_PROJECT_ID, SUBGRAPH_VERSION } from '@/utils/constants';
import { createContext, useMemo } from 'react';
import { useChainId } from 'wagmi';

export interface IAppConstantsContext extends ChainConstants {
  isChainSupported: boolean;
  subgraphUrl: string;
}

export const AppConstantsContext = createContext<IAppConstantsContext | null>(null);

const AppConstantsProvider = ({ children }: { children: React.ReactNode }) => {
  const connectedChainId = useChainId();

  const constants = useMemo(() => {
    const effectiveChainId = connectedChainId ?? supportedChains[0].id;
    return (
      appConstants[effectiveChainId as (typeof supportedChains)[number]['id']] ?? appConstants[supportedChains[0].id]
    );
  }, [connectedChainId]);

  const subgraphUrl = useMemo(() => {
    // Validate environment variables
    if (!SUBGRAPH_PROJECT_ID || !SUBGRAPH_VERSION) {
      console.error('Missing subgraph environment variables:', {
        SUBGRAPH_PROJECT_ID: SUBGRAPH_PROJECT_ID ? 'set' : 'missing',
        SUBGRAPH_VERSION: SUBGRAPH_VERSION ? 'set' : 'missing'
      });
      // Return a fallback or throw an error
      throw new Error('Subgraph configuration is incomplete. Please check environment variables.');
    }

    return `https://api.goldsky.com/api/public/${SUBGRAPH_PROJECT_ID}/subgraphs/privote-${constants.slugs.subgraph}/${SUBGRAPH_VERSION}/gn`;
  }, [constants.slugs.subgraph]);

  const isChainSupported = supportedChains.some(chain => chain.id === connectedChainId);

  return (
    <AppConstantsContext.Provider value={{ ...constants, isChainSupported, subgraphUrl }}>
      {children}
    </AppConstantsContext.Provider>
  );
};

export default AppConstantsProvider;
