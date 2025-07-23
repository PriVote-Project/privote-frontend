import { getInfuraHttpUrl } from '@/utils/networks';
import { http } from 'viem';
import { baseSepolia, optimismSepolia, scrollSepolia } from 'viem/chains';
import { fallback } from 'wagmi';

export const supportedChains = [optimismSepolia, baseSepolia, scrollSepolia] as const;

export const defaultChain = optimismSepolia;

export const transports = {
  [optimismSepolia.id]: fallback([http(), http(getInfuraHttpUrl(optimismSepolia.id))]),
  [baseSepolia.id]: fallback([http(), http(getInfuraHttpUrl(baseSepolia.id))]),
  [scrollSepolia.id]: fallback([http(), http(getInfuraHttpUrl(scrollSepolia.id))])
};
