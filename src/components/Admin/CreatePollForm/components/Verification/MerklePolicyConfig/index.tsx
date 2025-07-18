import styles from '../index.module.css';
import type { PolicyConfigType } from '../../../types';

/**
 * Configuration form for Merkle proof policy
 */
const MerklePolicyConfig = ({
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

export default MerklePolicyConfig;
