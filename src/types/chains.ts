export const ESupportedNetworks = {
  1: 'mainnet',
  10: 'optimism',
  42161: 'arbitrum-one',
  137: 'matic',
  59144: 'linea',
  8453: 'base',
  534352: 'scroll',
  11155420: 'optimism-sepolia',
  11155111: 'sepolia',
  421614: 'arbitrum-sepolia',
  84532: 'base-sepolia',
  534351: 'scroll-sepolia'
} as const;

export type TSupportedNetworks = keyof typeof ESupportedNetworks;
