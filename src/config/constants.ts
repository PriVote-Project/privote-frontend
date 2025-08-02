import { supportedChains } from '@/config/chains';
import { PollPolicyType } from '@/types';
import { Hex } from 'viem';
import { baseSepolia, optimismSepolia, scrollSepolia } from 'viem/chains';

export type ChainConstants = {
  chain: (typeof supportedChains)[number];
  contracts: {
    eas: Hex;
    anonAadhaarVerifier: Hex;
    semaphore: Hex;
    gitcoinPassportDecoder: Hex;
  };
  slugs: {
    eas: string;
    coordinator: string;
    infura: string;
    subgraph: string;
  };
  supportedPolicies: PollPolicyType[];
};

export const appConstants: Record<(typeof supportedChains)[number]['id'], ChainConstants> = {
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    contracts: {
      eas: '0x4200000000000000000000000000000000000021',
      anonAadhaarVerifier: '0x195CA63A04a22a552E3dDe8b7058B84D289a4FD6',
      semaphore: '0x697c80d1F2654e88d52B16154929EB976568DB04',
      gitcoinPassportDecoder: '0xe53C60F8069C2f0c3a84F9B3DB5cf56f3100ba56'
    },
    slugs: {
      eas: 'optimism-sepolia',
      coordinator: 'optimism-sepolia',
      infura: 'optimism-sepolia',
      subgraph: 'optimism-sepolia'
    },
    supportedPolicies: [
      PollPolicyType.FreeForAll,
      PollPolicyType.AnonAadhaar,
      PollPolicyType.EAS,
      PollPolicyType.ERC20,
      PollPolicyType.ERC20Votes,
      PollPolicyType.GitcoinPassport,
      PollPolicyType.Merkle,
      PollPolicyType.Token
    ]
  },
  [baseSepolia.id]: {
    chain: baseSepolia,
    contracts: {
      eas: '0x4200000000000000000000000000000000000021',
      anonAadhaarVerifier: '0x21046d78637897f667E1e3504A58777C0e9A95cc',
      semaphore: '0x697c80d1F2654e88d52B16154929EB976568DB04',
      gitcoinPassportDecoder: '0x'
    },
    slugs: {
      eas: 'base-sepolia',
      coordinator: 'base-sepolia',
      infura: 'base-sepolia',
      subgraph: 'base-sepolia'
    },
    supportedPolicies: [
      PollPolicyType.FreeForAll,
      PollPolicyType.AnonAadhaar,
      PollPolicyType.EAS,
      PollPolicyType.ERC20,
      PollPolicyType.ERC20Votes,
      PollPolicyType.Merkle,
      PollPolicyType.Token
    ]
  },
  [scrollSepolia.id]: {
    chain: scrollSepolia,
    contracts: {
      eas: '0xaEF4103A04090071165F78D45D83A0C0782c2B2a',
      anonAadhaarVerifier: '0x3e8baB4BD5c0e3A4f4a40AE6888913B9ea0A17B8',
      semaphore: '0x697c80d1F2654e88d52B16154929EB976568DB04',
      gitcoinPassportDecoder: '0x2443D22Db6d25D141A1138D80724e3Eee54FD4C2'
    },
    slugs: {
      eas: 'scroll-sepolia',
      coordinator: 'scroll-sepolia',
      infura: 'scroll-sepolia',
      subgraph: 'scroll-sepolia'
    },
    supportedPolicies: [
      PollPolicyType.FreeForAll,
      PollPolicyType.AnonAadhaar,
      PollPolicyType.EAS,
      PollPolicyType.ERC20,
      PollPolicyType.ERC20Votes,
      PollPolicyType.GitcoinPassport,
      PollPolicyType.Merkle,
      PollPolicyType.Token
    ]
  }
} as const;
