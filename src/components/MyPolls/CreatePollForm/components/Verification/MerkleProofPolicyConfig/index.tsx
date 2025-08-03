import { useState, useCallback, useRef, useMemo } from 'react';
import { MerkleTreeManager } from '@/services/MerkleTreeManager';
import styles from '../index.module.css';
import { IPolicyConfigProps } from '../types';
import { Hex } from 'viem';
import { StandardMerkleTreeData } from '@openzeppelin/merkle-tree/dist/standard';

type MerkleInputMode = 'addresses' | 'upload';

/**
 * Configuration form for Merkle proof policy
 */
const MerkleProofPolicyConfig = ({ config, onConfigChange }: IPolicyConfigProps) => {
  const [inputMode, setInputMode] = useState<MerkleInputMode>('addresses');
  const [addressList, setAddressList] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [treeMetadata, setTreeMetadata] = useState<{
    totalLeaves: number;
    treeDepth: number;
    generatedAt?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create MerkleTreeManager instance
  const merkleManager = useMemo(() => new MerkleTreeManager(), []);

  // Generate Merkle tree from addresses using MerkleTreeManager
  const generateMerkleTree = useCallback(
    (addresses: string[]) => {
      try {
        // Clean and validate addresses
        const cleanAddresses = addresses.map(addr => addr.trim()).filter(addr => addr.length > 0);

        if (cleanAddresses.length === 0) {
          throw new Error('No valid addresses provided');
        }

        // Use MerkleTreeManager to create tree
        const tree = merkleManager.createTreeFromAddresses(cleanAddresses as Hex[]);
        const root = tree.root;
        const treeJSON = merkleManager.exportToJSON(cleanAddresses);

        return {
          root,
          treeJSON
        };
      } catch (error) {
        throw new Error(`Failed to generate Merkle tree: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    [merkleManager]
  );

  // Handle address list change
  const handleAddressListChange = useCallback(
    (value: string) => {
      setAddressList(value);
      setFeedback('');

      if (!value.trim()) {
        onConfigChange({
          ...config,
          merkleRoot: '',
          merkleTreeData: ''
        });
        return;
      }

      const addresses = value
        .split('\n')
        .map(addr => addr.trim())
        .filter(Boolean);

      if (addresses.length === 0) {
        setFeedback('Please provide at least one address');
        return;
      }

      try {
        setIsGenerating(true);
        const treeData = generateMerkleTree(addresses);

        onConfigChange({
          ...config,
          merkleRoot: treeData.root,
          merkleTreeData: JSON.stringify(treeData.treeJSON)
        });

        setFeedback(`✅ Generated Merkle tree with ${addresses.length} addresses`);
      } catch (error) {
        setFeedback(`❌ ${error instanceof Error ? error.message : 'Failed to generate tree'}`);
        onConfigChange({
          ...config,
          merkleRoot: ''
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [config, onConfigChange, generateMerkleTree]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.type !== 'application/json') {
        setFeedback('❌ Please upload a JSON file');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const content = e.target?.result as string;
          const treeJSON: StandardMerkleTreeData<Hex[]> = JSON.parse(content);

          const tree = merkleManager.createTreeFromJSON(treeJSON);

          onConfigChange({
            ...config,
            merkleRoot: tree.root,
            merkleTreeData: content
          });

          setFeedback(`✅ Loaded tree with root ${tree.root}`);
        } catch (error) {
          setFeedback(`❌ ${error instanceof Error ? error.message : 'Failed to parse JSON'}`);
        }
      };

      reader.readAsText(file);
    },
    [config, onConfigChange, merkleManager]
  );

  // Clear file input
  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onConfigChange({
      ...config,
      merkleRoot: '',
      merkleTreeData: ''
    });
    setFeedback('');
    setTreeMetadata(null);
  }, [config, onConfigChange]);

  return (
    <div className={styles.policyConfig}>
      {/* Input Mode Selection */}
      <div className={styles.configField}>
        <label>Merkle Tree Configuration Method</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioOption}>
            <input
              type='radio'
              name='merkleInputMode'
              value='addresses'
              checked={inputMode === 'addresses'}
              onChange={() => setInputMode('addresses')}
            />
            <span>Provide Address List</span>
          </label>
          <label className={styles.radioOption}>
            <input
              type='radio'
              name='merkleInputMode'
              value='upload'
              checked={inputMode === 'upload'}
              onChange={() => setInputMode('upload')}
            />
            <span>Upload tree.json</span>
          </label>
        </div>
      </div>

      {/* Address List Input */}
      {inputMode === 'addresses' && (
        <div className={styles.configField}>
          <label htmlFor='addressList'>
            Eligible Addresses
            <span className={styles.helpText}>
              Enter one Ethereum address per line. The Merkle tree will be generated automatically.
            </span>
          </label>
          <textarea
            id='addressList'
            className={styles.textarea}
            placeholder='0x1234567890123456789012345678901234567890\n0xabcdefabcdefabcdefabcdefabcdefabcdefabcd\n...'
            value={addressList}
            onChange={e => handleAddressListChange(e.target.value)}
            rows={8}
            disabled={isGenerating}
          />
          {isGenerating && (
            <div className={styles.loadingIndicator}>
              <span>🔄 Generating Merkle tree...</span>
            </div>
          )}
        </div>
      )}

      {/* File Upload */}
      {inputMode === 'upload' && (
        <div className={styles.configField}>
          <label htmlFor='treeFile'>
            Upload tree.json
            <span className={styles.helpText}>
              Upload a JSON file containing the Merkle tree structure with root, leaves, and tree data.
            </span>
          </label>
          <div className={styles.fileUploadContainer}>
            <input
              ref={fileInputRef}
              type='file'
              id='treeFile'
              accept='.json'
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
            {config.merkleTreeData && (
              <button type='button' onClick={clearFileInput} className={styles.clearButton}>
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Generated Merkle Root Display */}
      {config.merkleRoot && (
        <div className={styles.configField}>
          <label htmlFor='merkleRoot'>Generated Merkle Root</label>
          <input type='text' id='merkleRoot' value={config.merkleRoot} readOnly className={styles.readOnlyInput} />
        </div>
      )}

      {/* Tree Metadata Display */}
      {treeMetadata && (
        <div className={styles.metadataBox}>
          <h4>🌳 Tree Information</h4>
          <div className={styles.metadataGrid}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Total Addresses:</span>
              <span className={styles.metadataValue}>{treeMetadata.totalLeaves}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Tree Depth:</span>
              <span className={styles.metadataValue}>{treeMetadata.treeDepth}</span>
            </div>
            {treeMetadata.generatedAt && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Generated:</span>
                <span className={styles.metadataValue}>{new Date(treeMetadata.generatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`${styles.feedback} ${feedback.includes('❌') ? styles.error : styles.success}`}>
          {feedback}
        </div>
      )}

      {/* Additional Info */}
      <div className={styles.infoBox}>
        <h4>📋 How it works:</h4>
        <ul>
          <li>
            <strong>Address List:</strong> Provide Ethereum addresses line by line. Our MerkleTreeManager will validate
            addresses, generate the tree, and provide detailed metadata.
          </li>
          <li>
            <strong>Upload tree.json:</strong> Upload a pre-generated tree file. We'll verify its integrity and recreate
            the tree to ensure validity.
          </li>
          <li>
            <strong>Validation:</strong> All trees are validated using keccak256 hashing with sorted pairs for
            consistency.
          </li>
          <li>
            <strong>Metadata:</strong> View tree depth, total leaves, and generation timestamp for transparency.
          </li>
          <li>
            <strong>Future:</strong> Tree data will be stored on IPFS for decentralized verification during voting.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MerkleProofPolicyConfig;
