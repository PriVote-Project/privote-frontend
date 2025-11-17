import { optimismSepolia, baseSepolia, optimism } from 'viem/chains';

// First chain will be used as default chain by wagmi
export const supportedChains = [optimismSepolia, baseSepolia, optimism] as const;
