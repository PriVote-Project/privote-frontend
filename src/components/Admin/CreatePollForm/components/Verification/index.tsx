import { PollPolicyType } from '@/types';
import { POLICY_ICONS } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { MdPolicy } from 'react-icons/md';
import type { PolicyConfigType, VerificationProps } from '../../types';
import styles from './index.module.css';

// Display names for each policy
const POLICY_NAMES = {
  [PollPolicyType.FreeForAll]: 'None',
  [PollPolicyType.AnonAadhaar]: 'Anon Aadhaar',
  [PollPolicyType.ERC20]: 'ERC20 Token',
  [PollPolicyType.Token]: 'Custom Token'
  // [PollPolicyType.Gitcoin]: 'Gitcoin Passport',
  // [PollPolicyType.Zupass]: 'Zupass',
  // [PollPolicyType.Merkle]: 'Merkle Proof',
  // [PollPolicyType.Semaphore]: 'Semaphore',
  // [PollPolicyType.EAS]: 'Ethereum Attestation Service'
};

// Define which policies require additional configuration
const POLICIES_WITH_CONFIG: Record<PollPolicyType, boolean> = {
  [PollPolicyType.FreeForAll]: false,
  [PollPolicyType.AnonAadhaar]: false,
  [PollPolicyType.ERC20]: true,
  [PollPolicyType.Token]: true
  // [PollPolicyType.Gitcoin]: false,
  // [PollPolicyType.Zupass]: false,
  // [PollPolicyType.Merkle]: true,
  // [PollPolicyType.Semaphore]: false,
  // [PollPolicyType.EAS]: true
};

/**
 * Configuration form for ERC20 policy
 */
const ERC20PolicyConfig = ({
  config,
  onConfigChange
}: {
  config: PolicyConfigType;
  onConfigChange: (config: PolicyConfigType) => void;
}) => (
  <div className={styles.policyConfig}>
    <div className={styles.configField}>
      <label htmlFor='tokenAddress'>Token Address</label>
      <input
        type='text'
        id='tokenAddress'
        placeholder='0x...'
        value={config.tokenAddress || ''}
        onChange={e => onConfigChange({ ...config, tokenAddress: e.target.value })}
      />
    </div>
    <div className={styles.configField}>
      <label htmlFor='tokenThreshold'>Minimum Token Balance</label>
      <input
        type='number'
        id='tokenThreshold'
        placeholder='1'
        value={config.threshold || ''}
        onChange={e => onConfigChange({ ...config, threshold: e.target.value })}
      />
    </div>
  </div>
);

/**
 * Configuration form for Token policy
 */
const TokenPolicyConfig = ({
  config,
  onConfigChange
}: {
  config: PolicyConfigType;
  onConfigChange: (config: PolicyConfigType) => void;
}) => (
  <div className={styles.policyConfig}>
    <div className={styles.configField}>
      <label htmlFor='tokenAddress'>Token Address</label>
      <input
        type='text'
        id='tokenAddress'
        placeholder='0x...'
        value={config.tokenAddress || ''}
        onChange={e => onConfigChange({ ...config, tokenAddress: e.target.value })}
      />
    </div>
  </div>
);

/**
 * Configuration form for Merkle proof policy
 */
const MerkleProofPolicyConfig = ({
  config,
  onConfigChange
}: {
  config: PolicyConfigType;
  onConfigChange: (config: PolicyConfigType) => void;
}) => (
  <div className={styles.policyConfig}>
    <div className={styles.configField}>
      <label htmlFor='merkleRoot'>Merkle Root</label>
      <input
        type='text'
        id='merkleRoot'
        placeholder='0x...'
        value={config.merkleRoot || ''}
        onChange={e => onConfigChange({ ...config, merkleRoot: e.target.value })}
      />
    </div>
  </div>
);

/**
 * Configuration form for EAS policy
 */
const EASPolicyConfig = ({
  config,
  onConfigChange
}: {
  config: PolicyConfigType;
  onConfigChange: (config: PolicyConfigType) => void;
}) => (
  <div className={styles.policyConfig}>
    <div className={styles.configField}>
      <label htmlFor='easContract'>EAS Contract</label>
      <input
        type='text'
        id='easContract'
        placeholder='0x...'
        value={config.easContract || ''}
        onChange={e => onConfigChange({ ...config, easContract: e.target.value })}
      />
    </div>
    <div className={styles.configField}>
      <label htmlFor='attester'>Attester Address</label>
      <input
        type='text'
        id='attester'
        placeholder='0x...'
        value={config.attester || ''}
        onChange={e => onConfigChange({ ...config, attester: e.target.value })}
      />
    </div>
    <div className={styles.configField}>
      <label htmlFor='schema'>Schema</label>
      <input
        type='text'
        id='schema'
        placeholder='0x...'
        value={config.schema || ''}
        onChange={e => onConfigChange({ ...config, schema: e.target.value })}
      />
    </div>
  </div>
);

/**
 * Get the appropriate configuration component based on policy type
 */
const getPolicyConfigComponent = (
  policyType: PollPolicyType,
  config: PolicyConfigType,
  onConfigChange: (config: PolicyConfigType) => void
) => {
  switch (policyType) {
    case PollPolicyType.ERC20:
      return <ERC20PolicyConfig config={config} onConfigChange={onConfigChange} />;
    case PollPolicyType.Token:
      return <TokenPolicyConfig config={config} onConfigChange={onConfigChange} />;
    // case PollPolicyType.Merkle:
    //   return <MerkleProofPolicyConfig config={config} onConfigChange={onConfigChange} />
    // case PollPolicyType.EAS:
    //   return <EASPolicyConfig config={config} onConfigChange={onConfigChange} />
    default:
      return null;
  }
};

/**
 * Main Verification component
 */
const Verification = ({
  handlePolicyTypeChange,
  policyType,
  policyConfig,
  onPolicyConfigChange
}: VerificationProps) => {
  const [selectedPolicy, setSelectedPolicy] = useState<PollPolicyType>(policyType);

  // Update selected policy when policyType changes externally
  useEffect(() => {
    setSelectedPolicy(policyType);
  }, [policyType]);

  // Handle policy selection
  const handlePolicySelect = (policy: PollPolicyType) => {
    setSelectedPolicy(policy);

    // Create a custom event to pass to the handler
    const event = {
      target: { value: policy }
    } as React.ChangeEvent<any>;

    handlePolicyTypeChange(event);
  };

  return (
    <div className={styles.verification}>
      <h1>Verification</h1>
      <p className={styles.description}>
        Select a verification method for your poll. This defines how users will authenticate to vote.
      </p>

      {/* Policy selection grid */}
      <div className={styles.policyGrid}>
        {Object.values(PollPolicyType).map(policy => (
          <button
            key={policy}
            type='button'
            className={`${styles.policyCard} ${selectedPolicy === policy ? styles.selected : ''}`}
            onClick={() => handlePolicySelect(policy)}
            aria-label={`Select ${POLICY_NAMES[policy]} verification method`}
          >
            {POLICY_ICONS[policy] ? (
              <img
                width={31}
                height={31}
                alt={`${POLICY_NAMES[policy]} icon`}
                src={POLICY_ICONS[policy]}
                className={styles.policyIcon}
              />
            ) : (
              <MdPolicy size={31} fill='#fff' />
            )}
            <span className={styles.policyName}>{POLICY_NAMES[policy]}</span>
          </button>
        ))}
      </div>

      {/* Additional configuration for selected policy */}
      {selectedPolicy && POLICIES_WITH_CONFIG[selectedPolicy] && (
        <div className={styles.configContainer}>
          <h2 className={styles.configTitle}>{POLICY_NAMES[selectedPolicy]} Configuration</h2>
          {getPolicyConfigComponent(
            selectedPolicy,
            policyConfig || {},
            onPolicyConfigChange || ((_: PolicyConfigType) => console.warn('Policy config change handler not provided'))
          )}
        </div>
      )}
    </div>
  );
};

export default Verification;
