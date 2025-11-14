import { supportedChains } from '@/config/chains';
import { PollPolicyType } from '@/types';
import { Hex } from 'viem';
import { baseSepolia, optimism, optimismSepolia, scrollSepolia } from 'viem/chains';

export interface FaucetProvider {
  name: string;
  url: string;
}

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
  subgraphProjectId: string;
  isTestnet: boolean;
  supportedPolicies: PollPolicyType[];
  faucets?: FaucetProvider[];
};

export const appConstants: Record<(typeof supportedChains)[number]['id'], ChainConstants> = {
  // Mainnet
  [optimism.id]: {
    chain: optimism,
    contracts: {
      eas: '0x4200000000000000000000000000000000000021',
      anonAadhaarVerifier: '0x45Db2e8649eaEB4D4c047bc790bd30Bc9e6C09f4',
      semaphore: '0x',
      gitcoinPassportDecoder: '0x5558D441779Eca04A329BcD6b47830D2C6607769'
    },
    slugs: {
      eas: 'optimism',
      coordinator: 'optimism',
      infura: 'optimism',
      subgraph: 'optimism'
    },
    subgraphProjectId: process.env.NEXT_PUBLIC_OPTIMISM_SUBGRAPH_PROJECT_ID || '',
    isTestnet: false,
    supportedPolicies: [
      PollPolicyType.FreeForAll,
      PollPolicyType.AnonAadhaar,
      PollPolicyType.EAS,
      PollPolicyType.ERC20,
      PollPolicyType.ERC20Votes,
      PollPolicyType.GitcoinPassport,
      PollPolicyType.MerkleProof,
      PollPolicyType.Token
    ]
  },

  // Testnets
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
    subgraphProjectId: process.env.NEXT_PUBLIC_SUBGRAPH_PROJECT_ID || '',
    isTestnet: true,
    supportedPolicies: [
      PollPolicyType.FreeForAll,
      PollPolicyType.AnonAadhaar,
      PollPolicyType.EAS,
      PollPolicyType.ERC20,
      PollPolicyType.ERC20Votes,
      PollPolicyType.GitcoinPassport,
      PollPolicyType.MerkleProof,
      PollPolicyType.Token
    ],
    faucets: [
      {
        name: 'Alchemy Faucet',
        url: 'https://www.alchemy.com/faucets/optimism-sepolia'
      },
      {
        name: 'Quicknode Faucet',
        url: 'https://faucet.quicknode.com/optimism/sepolia'
      }
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
    subgraphProjectId: process.env.NEXT_PUBLIC_SUBGRAPH_PROJECT_ID || '',
    isTestnet: true,
    supportedPolicies: [
      PollPolicyType.FreeForAll,
      PollPolicyType.AnonAadhaar,
      PollPolicyType.EAS,
      PollPolicyType.ERC20,
      PollPolicyType.ERC20Votes,
      PollPolicyType.MerkleProof,
      PollPolicyType.Token
    ],
    faucets: [
      {
        name: 'Alchemy Faucet',
        url: 'https://www.alchemy.com/faucets/base-sepolia'
      },
      {
        name: 'Quicknode Faucet',
        url: 'https://faucet.quicknode.com/base/sepolia'
      }
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
    subgraphProjectId: process.env.NEXT_PUBLIC_SUBGRAPH_PROJECT_ID || '',
    isTestnet: true,
    supportedPolicies: [
      PollPolicyType.FreeForAll,
      PollPolicyType.AnonAadhaar,
      PollPolicyType.EAS,
      PollPolicyType.ERC20,
      PollPolicyType.ERC20Votes,
      PollPolicyType.GitcoinPassport,
      PollPolicyType.MerkleProof,
      PollPolicyType.Token
    ],
    faucets: [
      {
        name: 'Scroll Sepolia Faucet',
        url: 'https://sepolia.scroll.io/faucet'
      },
      {
        name: 'Quicknode Faucet',
        url: 'https://faucet.quicknode.com/scroll/sepolia'
      }
    ]
  }
} as const;
