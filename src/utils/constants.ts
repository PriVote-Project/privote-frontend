import { PollPolicyType } from '@/types';

// Zero address constant (0x0 address) for Ethereum
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Zero bytes32 value
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

// MACI Subgraph enpoint
export const MACI_SUBGRAPH_ENDPOINT = process.env.NEXT_PUBLIC_PRIVOTE_SUBGRAPH_URL;

export const DEFAULT_SG_DATA = '0x';
export const DEFAULT_IVCP_DATA = '0x';

export const POLICY_ICONS = {
  [PollPolicyType.FreeForAll]: null,
  [PollPolicyType.AnonAadhaar]: '/anon-icon.svg',
  [PollPolicyType.ERC20]: null,
  [PollPolicyType.Token]: null
  // [PollPolicyType.Gitcoin]: '/passport-icon.svg',
  // [PollPolicyType.Zupass]: '/zupass-icon.png',
  // [PollPolicyType.Merkle]: null,
  // [PollPolicyType.Semaphore]: '/semaphore-icon.svg',
  // [PollPolicyType.EAS]: '/eas-icon.png'
};
