import { getInfuraHttpUrl } from '@/utils/networks';
import { http } from 'viem';
import { optimismSepolia, scrollSepolia, baseSepolia } from 'viem/chains';
import { fallback } from 'wagmi';

// First chain will be used as default chain by wagmi
export const supportedChains = [ optimismSepolia, scrollSepolia, baseSepolia] as const;

export const transports = {
  [optimismSepolia.id]: fallback([http(), http(getInfuraHttpUrl(optimismSepolia.id))]),
  [scrollSepolia.id]: fallback([http(), http(getInfuraHttpUrl(scrollSepolia.id))]),
  [baseSepolia.id]: fallback([http(), http(getInfuraHttpUrl(baseSepolia.id))]),
};
