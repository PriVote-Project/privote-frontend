import React, { useState } from 'react';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { useReadContract } from 'wagmi';
import { PolicyHookProps, PolicyHookResult } from './types';

// ERC721 minimal ABI with functions we need
const erc721ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    name: 'name',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'name', type: 'string' }],
    stateMutability: 'view'
  },
  {
    name: 'ownerOf',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'owner', type: 'address' }],
    stateMutability: 'view'
  }
] as const;

/**
 * Hook for handling Token (NFT) policy
 * Allows users to join if they own a specific NFT token
 *
 * @param props Policy hook props
 * @returns Policy hook result with methods and components
 */
export const useTokenPolicy = (props: PolicyHookProps): PolicyHookResult => {
  const { isConnected, isRegistered, policyData, address } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);

  // Extract token contract address from policyData
  const tokenAddress = policyData?.token?.address || '0x';
  const tokenName = policyData?.token?.name || 'Unknown';

  // Get user's token balance
  const { data: balanceData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc721ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!tokenAddress && tokenAddress !== '0x'
    }
  });

  const tokenBalance = balanceData ? Number(balanceData) : 0;

  // Get tokens owned by user (up to 10 tokens for UI display)
  const [userTokenIds, setUserTokenIds] = useState<bigint[]>([]);

  // Fetch user's token IDs when balance changes
  const fetchUserTokenIds = async () => {
    if (!address || !tokenAddress || tokenAddress === '0x' || !tokenBalance) {
      return [];
    }

    const tokenIds: bigint[] = [];
    // For simplicity, check the first 100 tokens
    // In a production app, you'd use a more efficient method like events or a tokenOfOwnerByIndex function
    for (let i = 0; i < 100 && tokenIds.length < tokenBalance && tokenIds.length < 10; i++) {
      try {
        const owner = await fetch(`/api/token-owner?tokenAddress=${tokenAddress}&tokenId=${i}`)
          .then(res => res.json())
          .then(data => data.owner);

        if (owner && owner.toLowerCase() === address.toLowerCase()) {
          tokenIds.push(BigInt(i));
        }
      } catch (error) {
        console.error(`Error fetching token ${i} owner:`, error);
      }
    }

    setUserTokenIds(tokenIds);
    if (tokenIds.length > 0 && !selectedTokenId) {
      setSelectedTokenId(tokenIds[0]);
    }

    return tokenIds;
  };

  // User can join if connected, not registered, and owns at least one token
  const canJoin = isConnected && !isRegistered && tokenBalance > 0 && selectedTokenId !== null;

  /**
   * Get signup data for Token policy (encode the selected tokenId)
   */
  const getSignupData = async (): Promise<string> => {
    setIsLoading(true);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      if (isRegistered) {
        throw new Error('Already registered');
      }

      if (!tokenAddress || tokenAddress === '0x') {
        throw new Error('Invalid token address');
      }

      if (tokenBalance <= 0) {
        throw new Error('You do not own any tokens from this collection');
      }

      if (!selectedTokenId) {
        throw new Error('No token selected');
      }

      // Encode the token ID as uint256 for the signup data
      return encodeAbiParameters(parseAbiParameters('uint256'), [selectedTokenId]);
    } catch (error) {
      console.error('Error generating Token policy signup data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Token Policy UI Component
   */
  const TokenPolicyComponent: React.FC = () => {
    // Fetch user tokens when component mounts
    React.useEffect(() => {
      if (tokenBalance > 0) {
        fetchUserTokenIds();
      }
    }, [tokenBalance, address]);

    if (tokenBalance <= 0) {
      return <p>You don't own any {tokenName || 'tokens'} from this collection</p>;
    }

    return (
      <div>
        <p>
          You own {tokenBalance} {tokenName || 'token(s)'} from this collection
        </p>

        {userTokenIds.length > 0 && (
          <div>
            <p>Select a token to use for joining:</p>
            <select
              value={selectedTokenId?.toString()}
              onChange={e => setSelectedTokenId(BigInt(e.target.value))}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '8px',
                width: '100%'
              }}
            >
              {userTokenIds.map(tokenId => (
                <option key={tokenId.toString()} value={tokenId.toString()}>
                  Token #{tokenId.toString()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  return {
    canJoin,
    getSignupData,
    isLoading,
    PolicyComponent: TokenPolicyComponent,
    requirementsDescription: `This poll requires you to own a ${tokenName || 'token'} from collection ${tokenAddress}`
  };
};
