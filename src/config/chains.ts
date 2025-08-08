import { getInfuraHttpUrl } from '@/utils/networks';
import { http } from 'viem';
import { optimismSepolia, scrollSepolia, baseSepolia } from 'viem/chains';
import { fallback } from 'wagmi';

export const supportedChains = [optimismSepolia, scrollSepolia, baseSepolia] as const;

export const defaultChain = baseSepolia;

export const transports = {
  [baseSepolia.id]: fallback([http(), http(getInfuraHttpUrl(baseSepolia.id))]),
  [optimismSepolia.id]: fallback([http(), http(getInfuraHttpUrl(optimismSepolia.id))]),
  [scrollSepolia.id]: fallback([http(), http(getInfuraHttpUrl(scrollSepolia.id))])
};
