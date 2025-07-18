import ERC20PolicyConfig from './ERC20PolicyConfig';
import TokenPolicyConfig from './TokenPolicyConfig';
import EASPolicyConfig from './EASPolicyConfig';
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
  [PollPolicyType.Token]: 'Custom Token',
  [PollPolicyType.EAS]: 'Ethereum Attestation Service'
  // [PollPolicyType.Gitcoin]: 'Gitcoin Passport',
  // [PollPolicyType.Zupass]: 'Zupass',
  // [PollPolicyType.Merkle]: 'Merkle Proof',
  // [PollPolicyType.Semaphore]: 'Semaphore',
};

// Define which policies require additional configuration
const POLICIES_WITH_CONFIG: Record<PollPolicyType, boolean> = {
  [PollPolicyType.FreeForAll]: false,
  [PollPolicyType.AnonAadhaar]: false,
  [PollPolicyType.ERC20]: true,
  [PollPolicyType.Token]: true,
  [PollPolicyType.EAS]: true
  // [PollPolicyType.Gitcoin]: false,
  // [PollPolicyType.Zupass]: false,
  // [PollPolicyType.Merkle]: true,
  // [PollPolicyType.Semaphore]: false,
};

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
    case PollPolicyType.EAS:
      return <EASPolicyConfig config={config} onConfigChange={onConfigChange} />;
    // case PollPolicyType.Merkle:
    //   return <MerkleProofPolicyConfig config={config} onConfigChange={onConfigChange} />
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
    } as React.ChangeEvent<HTMLSelectElement>;

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
            onPolicyConfigChange || (() => console.warn('Policy config change handler not provided'))
          )}
        </div>
      )}
    </div>
  );
};

export default Verification;
