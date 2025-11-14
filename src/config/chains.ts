import { optimismSepolia, scrollSepolia, baseSepolia, optimism } from 'viem/chains';

// First chain will be used as default chain by wagmi
export const supportedChains = [optimismSepolia, scrollSepolia, baseSepolia, optimism] as const;
