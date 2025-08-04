import { getInfuraHttpUrl } from '@/utils/networks';
import { http } from 'viem';
import { optimismSepolia, scrollSepolia } from 'viem/chains';
import { fallback } from 'wagmi';

export const supportedChains = [optimismSepolia, scrollSepolia] as const;

export const defaultChain = optimismSepolia;

export const transports = {
  [optimismSepolia.id]: fallback([http(), http(getInfuraHttpUrl(optimismSepolia.id))]),
  [scrollSepolia.id]: fallback([http(), http(getInfuraHttpUrl(scrollSepolia.id))])
};
