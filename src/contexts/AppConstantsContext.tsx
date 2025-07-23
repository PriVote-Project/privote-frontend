'use client';
import { defaultChain, supportedChains } from '@/config/chains';
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
    const effectiveChainId = connectedChainId ?? defaultChain.id;
    return appConstants[effectiveChainId as (typeof supportedChains)[number]['id']] ?? appConstants[defaultChain.id];
  }, [connectedChainId]);

  const subgraphUrl = `https://api.goldsky.com/api/public/${SUBGRAPH_PROJECT_ID}/subgraphs/privote-${constants.slugs.subgraph}/${SUBGRAPH_VERSION}/gn`;

  const isChainSupported = supportedChains.some(chain => chain.id === connectedChainId);

  return (
    <AppConstantsContext.Provider value={{ ...constants, isChainSupported, subgraphUrl }}>
      {children}
    </AppConstantsContext.Provider>
  );
};

export default AppConstantsProvider;
