'use client';

import useDecodeService from '@/hooks/useDecodeService';
import { usePollContext } from '@/hooks/usePollContext';
import { SemaphorePolicyData } from '@/services/decode/types';
import { PollPolicyType } from '@/types';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { encodeAbiParameters, parseAbiParameters, Hex } from 'viem';
import Common from '../Common';
import styles from '../styles.module.css';
import { PolicyProps } from '../types';

// Semaphore imports
import { Identity, Group, generateProof, type SemaphoreProof } from '@semaphore-protocol/core';
import { SemaphoreSubgraph } from '@semaphore-protocol/data';

// Types for better TypeScript support
interface GroupMember {
  commitment: string;
  index?: number;
}

interface SemaphoreGroup {
  id: string;
  admin?: string;
  merkleTree?: any;
}

type InputMode = 'proof' | 'privateKey';

// Helper function to get network name from chainId
const getNetworkName = (chainId?: number): string => {
  switch (chainId) {
    case 1:
      return 'mainnet';
    case 11155111:
      return 'sepolia';
    case 10:
      return 'optimism';
    case 42161:
      return 'arbitrum';
    case 137:
      return 'polygon';
    case 8453:
      return 'base';
    default:
      return 'mainnet'; // Default to mainnet
  }
};

const SemaphorePolicy = ({ policyData, signupState, setSignupState, onNext, onBack }: PolicyProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('proof');
  const [proofData, setProofData] = useState<SemaphoreProof | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const [commitment, setCommitment] = useState('');
  const [error, setError] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [fileName, setFileName] = useState('');

  const { isConnected, address, chainId } = useAccount();
  const { hasJoinedPoll: isRegistered } = usePollContext();

  // Extract semaphore policy data
  const decodedPolicyData = useDecodeService<SemaphorePolicyData>(PollPolicyType.Semaphore, policyData);
  const semaphoreContract = decodedPolicyData?.semaphore || '0x';
  const groupId = decodedPolicyData?.groupId || BigInt(0);
  const requirementsDescription = `This poll requires you to be a member of Semaphore group ${groupId} on contract ${semaphoreContract.slice(0, 10)}...`;

  // Generate proof from private key
  const generateProofFromPrivateKey = async () => {
    if (!privateKey.trim()) {
      setError('Please provide a private key');
      return;
    }

    setIsGeneratingProof(true);
    setError('');

    try {
      // Create identity from private key
      const identity = new Identity(privateKey);
      const identityCommitment = identity.commitment;

      // Determine the network based on chainId or use a default
      const networkName = getNetworkName(chainId);

      // Initialize Semaphore subgraph
      const semaphoreSubgraph = new SemaphoreSubgraph(networkName);

      // Fetch group from subgraph
      const groupData: SemaphoreGroup | null = await semaphoreSubgraph.getGroup(groupId.toString());

      if (!groupData) {
        throw new Error(`Group ${groupId} not found on ${networkName} network`);
      }

      // Get group members
      const membersData = await semaphoreSubgraph.getGroupMembers(groupId.toString());
      const members: GroupMember[] = Array.isArray(membersData)
        ? membersData.map((member: any) => ({
            commitment: typeof member === 'string' ? member : member.commitment,
            index: typeof member === 'object' ? member.index : undefined
          }))
        : [];

      if (!members || members.length === 0) {
        throw new Error(`No members found in group ${groupId}`);
      }

      // Check if identity is a member of the group
      const isMember = members.some(
        (member: GroupMember) => member.commitment.toString() === identityCommitment.toString()
      );

      if (!isMember) {
        throw new Error(
          'Your identity is not a member of this Semaphore group. Please ensure you have joined the group with this identity.'
        );
      }

      // Create group with members
      const group = new Group();
      members.forEach((member: GroupMember) => {
        group.addMember(BigInt(member.commitment));
      });

      // Generate message for proof (use custom commitment or wallet address)
      const message = commitment || address || '0';

      // Generate the proof
      const proof = await generateProof(identity, group, message, groupId);

      // Set the proof data directly (already in correct format)
      setProofData(proof);
      setInputMode('proof');
      setError('');
    } catch (err) {
      console.error('Error generating proof:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate proof. Please check your private key and try again.');
      }
    } finally {
      setIsGeneratingProof(false);
    }
  };

  // Handle JSON file upload for proof
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const parsedProof = JSON.parse(content) as SemaphoreProof;

        // Validate proof structure
        if (!validateSemaphoreProof(parsedProof)) {
          throw new Error('Invalid SemaphoreProof format. Please ensure your JSON contains all required fields.');
        }

        setProofData(parsedProof);
        setError('');
      } catch (err) {
        console.error('Error parsing proof file:', err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to parse proof file. Please ensure it's a valid JSON file with SemaphoreProof format."
        );
        setProofData(null);
      }
    };

    reader.readAsText(file);
  };

  // Validate SemaphoreProof structure
  const validateSemaphoreProof = (proof: any): proof is SemaphoreProof => {
    return (
      typeof proof === 'object' &&
      typeof proof.merkleTreeDepth === 'number' &&
      typeof proof.merkleTreeRoot === 'string' &&
      typeof proof.message === 'string' &&
      typeof proof.nullifier === 'string' &&
      typeof proof.scope === 'string' &&
      Array.isArray(proof.points) &&
      proof.points.every((point: any) => typeof point === 'string')
    );
  };

  const handleNext = async () => {
    if (!proofData) {
      setError('Please provide a valid SemaphoreProof');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      if (isRegistered) {
        throw new Error('Already registered');
      }

      // Encode the SemaphoreProof struct for the signup data
      const encodedData = encodeAbiParameters(
        parseAbiParameters('(uint256,uint256,uint256,uint256,uint256,uint256[])'),
        [
          [
            BigInt(proofData.merkleTreeDepth),
            BigInt(proofData.merkleTreeRoot),
            BigInt(proofData.message),
            BigInt(proofData.nullifier),
            BigInt(proofData.scope),
            proofData.points.map(point => BigInt(point))
          ]
        ]
      );

      setSignupState(prev => ({
        ...prev,
        data: encodedData
      }));

      onNext();
    } catch (error) {
      console.error('Error generating Semaphore policy signup data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const canJoin = isConnected && !isRegistered && proofData !== null;
    setSignupState(prev => ({ ...prev, canJoin }));
  }, [isConnected, isRegistered, proofData, setSignupState]);

  return (
    <Common
      canJoin={signupState.canJoin}
      requirementsDescription={requirementsDescription}
      isLoading={isLoading}
      onNext={handleNext}
      onBack={onBack}
    >
      <div className={styles.policyHeader}>
        <div className={styles.policyIconWrapper}>
          <img src='/semaphore-icon.svg' alt='Semaphore' className={styles.policyIcon} />
        </div>
        <div className={styles.policyTitle}>
          <h4>Semaphore Group Access</h4>
          <span className={styles.policySubtitle}>Zero-Knowledge Group Membership</span>
        </div>
      </div>

      <div className={styles.policyDetails}>
        <div className={styles.policyDetailRow}>
          <span className={styles.detailLabel}>Semaphore Contract:</span>
          <span className={`${styles.detailValue} ${styles.addressText}`}>{semaphoreContract}</span>
        </div>

        <div className={styles.policyDetailRow}>
          <span className={styles.detailLabel}>Group ID:</span>
          <span className={`${styles.detailValue} ${styles.addressText}`}>{groupId.toString()}</span>
        </div>
      </div>

      {/* Input Mode Selection */}
      <div className={styles.semaphoreInputSection}>
        <div className={styles.semaphoreModeSelector}>
          <h5>Choose Input Method</h5>
          <div className={styles.semaphoreModeButtons}>
            <button
              type='button'
              onClick={() => setInputMode('proof')}
              className={`${styles.semaphoreModeBtn} ${inputMode === 'proof' ? styles.active : ''}`}
            >
              Direct Proof
            </button>
            <button
              type='button'
              onClick={() => setInputMode('privateKey')}
              className={`${styles.semaphoreModeBtn} ${inputMode === 'privateKey' ? styles.active : ''}`}
            >
              Private Key
            </button>
          </div>
        </div>

        {/* JSON File Upload for Proof */}
        {inputMode === 'proof' && (
          <div className={styles.semaphoreInputWrapper}>
            <label htmlFor='proofFile'>Upload SemaphoreProof JSON File</label>
            <div className={styles.semaphoreFileUploadWrapper}>
              <input
                type='file'
                id='proofFile'
                accept='.json'
                onChange={handleFileUpload}
                className={styles.semaphoreFileInput}
              />
              <div className={styles.semaphoreFileUploadArea}>
                <div className={styles.semaphoreUploadIcon}>📁</div>
                <p>Click to select a JSON file or drag and drop</p>
                <small>Accepts .json files with SemaphoreProof format</small>
              </div>
            </div>

            {fileName && (
              <div className={styles.semaphoreFileName}>
                <span>📄 {fileName}</span>
              </div>
            )}

            {proofData && (
              <div className={styles.semaphoreProofPreview}>
                <h6>Proof Preview:</h6>
                <div className={styles.semaphoreProofDetails}>
                  <div>
                    <strong>Merkle Tree Depth:</strong> {proofData.merkleTreeDepth}
                  </div>
                  <div>
                    <strong>Nullifier:</strong> {proofData.nullifier.slice(0, 20)}...
                  </div>
                  <div>
                    <strong>Message:</strong> {proofData.message.slice(0, 20)}...
                  </div>
                  <div>
                    <strong>Points:</strong> {proofData.points.length} elements
                  </div>
                </div>
              </div>
            )}

            <div className={styles.semaphoreHelpText}>
              <p>
                <strong>SemaphoreProof JSON Format:</strong>
              </p>
              <pre className={styles.semaphoreCodeBlock}>
                {`{
                    "merkleTreeDepth": 20,
                    "merkleTreeRoot": "123...",
                    "message": "456...",
                    "nullifier": "789...",
                    "scope": "101112...",
                    "points": ["131415...", "161718..."]
                  }`}
              </pre>
              <p>Upload a JSON file containing your SemaphoreProof with all required fields.</p>
            </div>
          </div>
        )}

        {/* Private Key Input */}
        {inputMode === 'privateKey' && (
          <div className={styles.semaphoreInputWrapper}>
            <div className={styles.semaphorePrivateKeySection}>
              <label htmlFor='privateKey'>Private Key</label>
              <input
                type='password'
                id='privateKey'
                value={privateKey}
                onChange={e => setPrivateKey(e.target.value)}
                placeholder='Enter your Semaphore identity private key'
                className={styles.semaphorePrivateKeyInput}
              />
            </div>

            <div className={styles.semaphoreCommitmentSection}>
              <label htmlFor='commitment'>Commitment (Optional)</label>
              <input
                type='text'
                id='commitment'
                value={commitment}
                onChange={e => setCommitment(e.target.value)}
                placeholder='Custom commitment or leave empty to use wallet address'
                className={styles.semaphoreCommitmentInput}
              />
            </div>

            <button
              type='button'
              onClick={generateProofFromPrivateKey}
              disabled={isGeneratingProof || !privateKey.trim()}
              className={styles.semaphoreGenerateBtn}
            >
              {isGeneratingProof ? (
                <>
                  <div className={styles.semaphoreSpinner}></div>
                  Generating Proof...
                </>
              ) : (
                'Generate Proof'
              )}
            </button>

            <div className={styles.semaphoreHelpText}>
              <p>
                Your private key will be used to generate a zero-knowledge proof of group membership. The key is
                processed locally and never sent to any server.
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className={styles.semaphoreErrorMessage}>
            <div className={styles.semaphoreErrorIcon}>❌</div>
            <span>{error}</span>
          </div>
        )}

        {/* Success Display */}
        {proofData && (
          <div className={styles.semaphoreSuccessMessage}>
            <div className={styles.semaphoreSuccessIcon}>✅</div>
            <span>Proof ready! You can now join the poll.</span>
          </div>
        )}
      </div>
    </Common>
  );
};

export default SemaphorePolicy;
