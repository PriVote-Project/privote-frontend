import { toBytes, toHex, type Hex } from 'viem';

interface OptionInfo {
  cid: `0x${string}`;
  description?: string;
  link?: string;
  // Add more fields here in the future
}

export function encodeOptionInfo(info: OptionInfo): Hex {
  // Create an object with version for future compatibility
  const data = {
    version: 2,
    cid: info.cid,
    description: info.description || '',
    link: info.link || ''
  };

  // Convert to JSON and then to bytes
  const jsonString = JSON.stringify(data);
  const bytes = toBytes(jsonString);
  return toHex(bytes);
}
