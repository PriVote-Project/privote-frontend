import { TSupportedNetworks } from '@/types/chains';

export const EASNetworkSlugs = {
  1: 'ethereum',
  10: 'optimism',
  42161: 'arbitrum',
  137: 'polygon',
  59144: 'linea',
  8453: 'base',
  534352: 'scroll',
  11155420: 'optimism-sepolia',
  11155111: 'sepolia',
  84532: 'base-sepolia'
};

export const getGqlUrl = (chainId: TSupportedNetworks) => {
  const slug = EASNetworkSlugs[chainId as keyof typeof EASNetworkSlugs];
  if (!slug) {
    throw new Error(`No EAS subgraph found for chainId: ${chainId}`);
  }

  return `https://${slug}.easscan.org/graphql`;
};

export const SemaphoreNetworks = {
  1: { name: 'mainnet', address: '0x697c80d1F2654e88d52B16154929EB976568DB04', rpc: 'https://mainnet.infura.io/v3/' },
  10: {
    name: 'optimism',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://optimism-mainnet.infura.io/v3/'
  },
  42161: {
    name: 'arbitrum',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://arbitrum-mainnet.infura.io/v3/'
  },
  137: {
    name: 'matic',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://polygon-mainnet.infura.io/v3/'
  },
  59144: {
    name: 'linea',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://linea-mainnet.infura.io/v3/'
  },
  8453: {
    name: 'base',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://base-mainnet.infura.io/v3/'
  },
  11155420: {
    name: 'optimism-sepolia',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://optimism-sepolia.infura.io/v3/'
  },
  11155111: {
    name: 'sepolia',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://sepolia.infura.io/v3/'
  },
  421614: {
    name: 'arbitrum-sepolia',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://arbitrum-sepolia.infura.io/v3/'
  },
  84532: {
    name: 'base-sepolia',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://base-sepolia.infura.io/v3/'
  },
  534351: {
    name: 'scroll-sepolia',
    address: '0x697c80d1F2654e88d52B16154929EB976568DB04',
    rpc: 'https://scroll-sepolia.infura.io/v3/'
  }
};
