export const ESupportedNetworks = {
  1: 'mainnet',
  10: 'optimism',
  11155420: 'optimism-sepolia',
  56: 'bsc',
  // 97: 'chapel',
  100: 'gnosis',
  137: 'matic',
  42161: 'arbitrum-one',
  17000: 'holesky',
  59141: 'linea-sepolia',
  84532: 'base-sepolia',
  11155111: 'sepolia',
  421614: 'arbitrum-sepolia',
  59144: 'linea',
  8453: 'base',
  534351: 'scroll-sepolia',
  534352: 'scroll'
} as const;

export type TSupportedNetworks = keyof typeof ESupportedNetworks;
