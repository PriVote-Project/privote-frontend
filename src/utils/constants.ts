import { PollPolicyType } from '@/types';

// Zero address constant (0x0 address) for Ethereum
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Zero bytes32 value
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

// MACI Subgraph enpoint
export const MACI_SUBGRAPH_ENDPOINT = process.env.NEXT_PUBLIC_PRIVOTE_SUBGRAPH_URL;
export const PUBLIC_COORDINATOR_SERVICE_URL = process.env.NEXT_PUBLIC_COORDINATOR_SERVICE_URL;

export const DEFAULT_SG_DATA = '0x';
export const DEFAULT_IVCP_DATA = '0x';

export const POLICY_ICONS = {
  [PollPolicyType.AnonAadhaar]: '/anon-icon.svg',
  [PollPolicyType.EAS]: '/eas-icon.png',
  [PollPolicyType.ERC20]: null,
  [PollPolicyType.ERC20Votes]: null,
  [PollPolicyType.FreeForAll]: null,
  [PollPolicyType.GitcoinPassport]: '/passport-icon.svg',
  // [PollPolicyType.Hats]: null,
  // [PollPolicyType.Merkle]: null,
  [PollPolicyType.Semaphore]: '/semaphore-icon.svg',
  [PollPolicyType.Token]: null
  // [PollPolicyType.Zupass]: '/zupass-icon.png'
};
