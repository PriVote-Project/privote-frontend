import { PollPolicyType } from '@/types';

// Zero address constant (0x0 address) for Ethereum
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Zero bytes32 value
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

// MACI Subgraph enpoint
export const SUBGRAPH_PROJECT_ID = process.env.NEXT_PUBLIC_SUBGRAPH_PROJECT_ID;
export const SUBGRAPH_VERSION = process.env.NEXT_PUBLIC_SUBGRAPH_VERSION;
export const PUBLIC_COORDINATOR_SERVICE_URL = process.env.NEXT_PUBLIC_COORDINATOR_SERVICE_URL;
export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const appName = 'PRIVOTE';
const purpose = 'This signature will be used to generate your secure MACI private key.';
export const SIGNATURE_MESSAGE = `Welcome to ${appName}! ${purpose}`;

export const DEFAULT_VOICE_CREDITS = 1n;
export const MAX_VOICE_CREDITS = 100n;
export const DEFAULT_SG_DATA = '0x';
export const DEFAULT_IVCP_DATA = '0x';

export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_HOUR_MS = 60 * 60 * 1000;

// Wallet connector names
export const PORTO_CONNECTOR_NAME = 'Email or Passkey';

export const POLICY_ICONS = {
  [PollPolicyType.AnonAadhaar]: '/icons/aadhaar-icon.svg',
  [PollPolicyType.EAS]: '/icons/eas-icon.png',
  [PollPolicyType.ERC20]: '/icons/token-icon.svg',
  [PollPolicyType.ERC20Votes]: '/icons/erc20Votes-icon.svg',
  [PollPolicyType.FreeForAll]: '/icons/free-icon.svg',
  [PollPolicyType.GitcoinPassport]: '/icons/passport-icon.svg',
  // [PollPolicyType.Hats]: null,
  [PollPolicyType.MerkleProof]: '/icons/merkle-icon.svg',
  // [PollPolicyType.Semaphore]: '/icons/semaphore-icon.svg',
  [PollPolicyType.Token]: '/icons/nft-icon.svg'
  // [PollPolicyType.Zupass]: '/icons/zupass-icon.png'
};
