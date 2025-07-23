'use client';

import useDecodeService from '@/hooks/useDecodeService';
import usePollContext from '@/hooks/usePollContext';
import { TokenPolicyData } from '@/services/decode/types';
import { PollPolicyType } from '@/types';
import { notification } from '@/utils/notification';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { encodeAbiParameters, erc721Abi, parseAbiParameters } from 'viem';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import Common from '../Common';
import styles from '../styles.module.css';
import { PolicyProps } from '../types';

interface TokenInfo {
  tokenId: bigint;
  isSelected: boolean;
}

interface ManualTokenCheck {
  tokenId: bigint | null;
  isOwned: boolean | null;
  isChecking: boolean;
}

const TokenPolicy = ({ policyData, signupState, setSignupState, onNext, onBack }: PolicyProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [manualTokenId, setManualTokenId] = useState<string>('');
  const [manualTokenCheck, setManualTokenCheck] = useState<ManualTokenCheck>({
    tokenId: null,
    isOwned: null,
    isChecking: false
  });
  const { isConnected, address } = useAccount();
  const { hasJoinedPoll: isRegistered } = usePollContext();

  // Extract token contract address from policyData
  const decodedPolicyData = useDecodeService<TokenPolicyData>(PollPolicyType.Token, policyData);
  const tokenAddress = decodedPolicyData?.token?.address || '0x';
  const contractName = decodedPolicyData?.token?.name || 'Unknown';
  const contractSymbol = decodedPolicyData?.token?.symbol || 'Unknown';

  // Prepare contract calls for basic info and balance
  const basicContracts = [
    {
      address: tokenAddress as `0x${string}`,
      abi: erc721Abi,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    },
    {
      address: tokenAddress as `0x${string}`,
      abi: erc721Abi,
      functionName: 'supportsInterface',
      args: ['0x780e9d63'] // ERC721Enumerable interface
    }
  ];

  const { data: basicData, isLoading: basicLoading } = useReadContracts({
    contracts: basicContracts,
    query: {
      enabled: !!address && !!tokenAddress && tokenAddress !== '0x' && isConnected
    }
  });

  const tokenBalance = basicData?.[0]?.result ? Number(basicData[0].result) : 0;
  const supportsEnumerable = Boolean(basicData?.[1]?.result);

  const displayName = contractName || '';
  const displaySymbol = contractSymbol || '';

  const requirementsDescription = `This poll requires you to own a token from the ${displayName || 'specified'} collection (${tokenAddress})`;

  // Prepare contracts for fetching token IDs (only if enumerable and user has tokens)
  const tokenIdContracts = useMemo(() => {
    if (!supportsEnumerable || tokenBalance === 0 || !address || !tokenAddress) {
      return [];
    }

    return Array.from({ length: Math.min(tokenBalance, 10) }, (_, index) => ({
      address: tokenAddress as `0x${string}`,
      abi: erc721Abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [address as `0x${string}`, BigInt(index)]
    }));
  }, [supportsEnumerable, tokenBalance, address, tokenAddress]);

  const { data: tokenIds, isLoading: tokenIdsLoading } = useReadContracts({
    contracts: tokenIdContracts,
    query: {
      enabled: tokenIdContracts.length > 0
    }
  });

  // Manual token ownership check for non-enumerable contracts
  const { data: tokenOwner, isLoading: isCheckingOwnership } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc721Abi,
    functionName: 'ownerOf',
    args: [manualTokenCheck.tokenId as bigint],
    query: {
      enabled: !!manualTokenCheck.tokenId && !supportsEnumerable && !!tokenAddress && tokenAddress !== '0x'
    }
  });

  // Update manual token check when ownership data changes
  useEffect(() => {
    if (manualTokenCheck.tokenId && tokenOwner !== undefined) {
      const isOwned = tokenOwner?.toLowerCase() === address?.toLowerCase();
      setManualTokenCheck(prev => ({
        ...prev,
        isOwned,
        isChecking: false
      }));

      // Auto-select if owned
      if (isOwned) {
        setSelectedTokenId(manualTokenCheck.tokenId);
      }
    }
  }, [tokenOwner, address, manualTokenCheck.tokenId]);

  // Update user tokens when data changes
  useEffect(() => {
    if (!supportsEnumerable) {
      setFetchError('This contract does not support token enumeration. Cannot fetch your tokens automatically.');
      setUserTokens([]);
      return;
    }

    if (tokenBalance === 0) {
      setUserTokens([]);
      setSelectedTokenId(null);
      setFetchError(null);
      return;
    }

    if (tokenIds && tokenIds.length > 0) {
      const tokens: TokenInfo[] = tokenIds
        .filter(result => result.status === 'success' && result.result)
        .map(result => ({
          tokenId: BigInt(result.result as string),
          isSelected: false
        }));

      setUserTokens(tokens);
      setFetchError(null);

      // Auto-select the first token if available and none selected
      if (tokens.length > 0 && !selectedTokenId) {
        setSelectedTokenId(tokens[0].tokenId);
      }
    }
  }, [tokenIds, tokenBalance, supportsEnumerable, selectedTokenId]);

  const handleNext = () => {
    setIsLoading(true);

    try {
      if (!isConnected) {
        notification.error('Wallet not connected');
        throw new Error('Wallet not connected');
      }

      if (isRegistered) {
        notification.error('Already registered');
        throw new Error('Already registered');
      }

      if (!tokenAddress || tokenAddress === '0x') {
        notification.error('Invalid token address');
        throw new Error('Invalid token address');
      }

      if (tokenBalance <= 0) {
        notification.error('You do not own any tokens from this collection');
        throw new Error('You do not own any tokens from this collection');
      }

      if (!selectedTokenId) {
        notification.error('Please select a token to use for joining');
        throw new Error('No token selected');
      }

      // Encode the token ID as uint256 for the signup data
      const encodedData = encodeAbiParameters(parseAbiParameters('uint256'), [selectedTokenId]);
      setSignupState(prev => ({ ...prev, data: encodedData }));
      onNext();
    } catch (error) {
      console.error('Error generating Token policy signup data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle token selection
   */
  const handleTokenSelect = useCallback((tokenId: bigint) => {
    setSelectedTokenId(tokenId);
    setUserTokens(prev =>
      prev.map(token => ({
        ...token,
        isSelected: token.tokenId === tokenId
      }))
    );
  }, []);

  /**
   * Handle manual token ID input
   */
  const handleManualTokenInput = useCallback((value: string) => {
    setManualTokenId(value);

    // Clear previous check results
    setManualTokenCheck({
      tokenId: null,
      isOwned: null,
      isChecking: false
    });

    // If input is empty, clear selection
    if (!value.trim()) {
      setSelectedTokenId(null);
      return;
    }

    // Try to parse the token ID
    try {
      const tokenId = BigInt(value.trim());
      setManualTokenCheck({
        tokenId,
        isOwned: null,
        isChecking: true
      });
    } catch {
      // Invalid number format
      setManualTokenCheck({
        tokenId: null,
        isOwned: false,
        isChecking: false
      });
    }
  }, []);

  const handleManualTokenInputMemo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleManualTokenInput(e.target.value);
    },
    [handleManualTokenInput]
  );

  useEffect(() => {
    const canJoin = isConnected && !isRegistered && tokenBalance > 0 && selectedTokenId !== null;
    setSignupState(prev => ({ ...prev, canJoin }));
  }, [isConnected, isRegistered, tokenBalance, selectedTokenId, setSignupState]);

  return (
    <Common
      canJoin={signupState.canJoin}
      requirementsDescription={requirementsDescription}
      isLoading={isLoading}
      onNext={handleNext}
      onBack={onBack}
    >
      {!isConnected ? (
        <div className={styles.errorMessage}>Please connect your wallet to check token ownership</div>
      ) : basicLoading ? (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <span>Loading contract information...</span>
        </div>
      ) : tokenBalance === 0 ? (
        <>
          <div className={styles.policyHeader}>
            <div className={styles.policyIconWrapper}>
              <img src='/icons/nft-icon.svg' alt='NFT' className={styles.policyIcon} />
            </div>
            <div className={styles.policyTitle}>
              <h4>NFT-Based Access</h4>
              <span className={styles.policySubtitle}>Token Ownership Required</span>
            </div>
          </div>
          <div className={styles.policyDetails}>
            {displayName && (
              <div className={styles.policyDetailRow}>
                <span className={styles.detailLabel}>Collection:</span>
                <span className={styles.detailValue}>
                  {displayName} {displaySymbol && `(${displaySymbol})`}
                </span>
              </div>
            )}
            <div className={styles.policyDetailRow}>
              <span className={styles.detailLabel}>Contract:</span>
              <span className={styles.detailValue}>
                <span className={styles.addressText}>{tokenAddress}</span>
              </span>
            </div>
            <div className={styles.policyDetailRow}>
              <span className={styles.detailLabel}>Your Balance:</span>
              <span className={styles.detailValue}>
                <span className={styles.highlight}>0 tokens</span>
              </span>
            </div>
          </div>
          <div className={styles.noTokensMessage}>
            <div className={styles.noTokensIcon}>
              <img src='/icons/nft-icon.svg' alt='No tokens' />
            </div>
            <p>You don&apos;t own any tokens from this collection.</p>
            <p>You need to own at least one token to participate in this poll.</p>
          </div>
        </>
      ) : (
        <>
          <div className={styles.policyHeader}>
            <div className={styles.policyIconWrapper}>
              <img src='/icons/nft-icon.svg' alt='NFT' className={styles.policyIcon} />
            </div>
            <div className={styles.policyTitle}>
              <h4>NFT-Based Access</h4>
              <span className={styles.policySubtitle}>Token Ownership Required</span>
            </div>
          </div>

          <div className={styles.policyDetails}>
            {displayName && (
              <div className={styles.policyDetailRow}>
                <span className={styles.detailLabel}>Collection:</span>
                <span className={styles.detailValue}>
                  {displayName} {displaySymbol && `(${displaySymbol})`}
                </span>
              </div>
            )}
            <div className={styles.policyDetailRow}>
              <span className={styles.detailLabel}>Contract:</span>
              <span className={styles.detailValue}>
                <span className={styles.addressText}>{tokenAddress}</span>
              </span>
            </div>
            <div className={styles.policyDetailRow}>
              <span className={styles.detailLabel}>Your Balance:</span>
              <span className={styles.detailValue}>
                <span className={styles.highlight}>{tokenBalance} tokens</span>
              </span>
            </div>
          </div>

          {fetchError && <div className={styles.errorMessage}>{fetchError}</div>}

          {!supportsEnumerable ? (
            <div className={styles.tokenSelection}>
              <h4 className={styles.tokenSelectionTitle}>Enter your Token ID:</h4>

              <div className={styles.manualTokenInput}>
                <div className={styles.tokenInputDescription}>
                  This contract doesn&apos;t support automatic token discovery. Please enter the Token ID you own.
                </div>
                <input
                  type='text'
                  value={manualTokenId}
                  onChange={handleManualTokenInputMemo}
                  placeholder='Enter Token ID (e.g., 1234)'
                  className={styles.tokenInput}
                />
                <div className={styles.tokenInputHint}>
                  Enter a valid token ID number that you own from this collection
                </div>
              </div>

              {manualTokenCheck.isChecking || isCheckingOwnership ? (
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                  <span>Checking token ownership...</span>
                </div>
              ) : manualTokenCheck.tokenId && manualTokenCheck.isOwned !== null ? (
                <div
                  className={`${styles.statusIndicator} ${manualTokenCheck.isOwned ? styles.success : styles.error}`}
                >
                  {manualTokenCheck.isOwned ? (
                    <>
                      <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                        <path
                          d='M13.5 4.5L6 12L2.5 8.5'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      You own Token #{manualTokenCheck.tokenId.toString()}
                    </>
                  ) : (
                    <>
                      <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                        <path
                          d='M15 5L5 15M5 5L15 15'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      You don&apos;t own Token #{manualTokenCheck.tokenId.toString()}
                    </>
                  )}
                </div>
              ) : manualTokenId && !manualTokenCheck.tokenId ? (
                <div className={`${styles.statusIndicator} ${styles.error}`}>
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                      d='M15 5L5 15M5 5L15 15'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Invalid Token ID format
                </div>
              ) : null}
            </div>
          ) : tokenIdsLoading ? (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <span>Loading your tokens...</span>
            </div>
          ) : userTokens.length > 0 ? (
            <div className={styles.tokenSelection}>
              <h4 className={styles.tokenSelectionTitle}>Select a token to use for joining:</h4>
              <div className={styles.tokenList}>
                {userTokens.map(token => (
                  <div
                    key={token.tokenId.toString()}
                    className={`${styles.tokenItem} ${selectedTokenId === token.tokenId ? styles.selected : ''}`}
                    onClick={() => handleTokenSelect(token.tokenId)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleTokenSelect(token.tokenId);
                      }
                    }}
                  >
                    <div className={styles.tokenIcon}>#{token.tokenId.toString().slice(-4)}</div>
                    <div className={styles.tokenInfo}>
                      <div className={styles.tokenId}>Token #{token.tokenId.toString()}</div>
                      <div className={styles.tokenDescription}>{displayName} NFT</div>
                    </div>
                    <div className={`${styles.tokenStatus} ${styles.owned}`}>
                      {selectedTokenId === token.tokenId ? 'Selected' : 'Owned'}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTokenId && (
                <div className={`${styles.statusIndicator} ${styles.success}`}>
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                      d='M13.5 4.5L6 12L2.5 8.5'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Token #{selectedTokenId.toString()} selected for poll registration
                </div>
              )}
            </div>
          ) : tokenBalance > 0 ? (
            <div className={styles.errorMessage}>
              Unable to load your tokens. You own {tokenBalance} tokens but they could not be retrieved.
            </div>
          ) : null}
        </>
      )}
    </Common>
  );
};

export default TokenPolicy;
