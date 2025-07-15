import { hexToString, toBytes, toHex, type Hex } from 'viem';

interface OptionInfo {
  cid: `0x${string}`;
  description?: string;
  link?: string;
  // Add more fields here in the future
}

export function encodeOptionInfo(info: OptionInfo): Hex {
  console.log(info.cid);
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

export function decodeOptionInfo(hexString: Hex): OptionInfo {
  try {
    // Convert hex string to UTF-8 string
    const jsonString = hexToString(hexString);
    const data = JSON.parse(jsonString);

    // Handle different versions in the future
    if (data.version === 1) {
      return {
        cid: data.cid as `0x${string}`,
        description: data.description
      };
    }

    if (data.version === 2) {
      return {
        cid: data.cid as `0x${string}`,
        description: data.description,
        link: data.link
      };
    }

    // Fallback for unknown versions
    return {
      cid: data.cid as `0x${string}`
    };
  } catch (e) {
    // Fallback for legacy format (just CID)
    return {
      cid: hexString as `0x${string}`
    };
  }
}
