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
