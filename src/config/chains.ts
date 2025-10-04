import { optimismSepolia, scrollSepolia, baseSepolia } from 'viem/chains';

// First chain will be used as default chain by wagmi
export const supportedChains = [optimismSepolia, scrollSepolia, baseSepolia] as const;
