import styles from '../index.module.css';
import type { PolicyConfigType } from '../../../types';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { EASContractAddresses, EASNetworkSlugs } from '../constants';
import { TSupportedNetworks } from '@/types/chains';

/**
 * Configuration form for EAS policy
 */
const EASPolicyConfig = ({
  config,
  onConfigChange
}: {
  config: PolicyConfigType;
  onConfigChange: (config: PolicyConfigType) => void;
}) => {
  const { isConnected, chainId } = useAccount();
  const [feedback, setFeedback] = useState('');
  const [explorerUrl, setExplorerUrl] = useState('');

  useEffect(() => {
    if (!isConnected) {
      setFeedback('Connect to wallet to auto-select EAS contract.');
      onConfigChange({ ...config, easContract: '' });
      setExplorerUrl('');
    } else if (chainId) {
      const easContractAddress = EASContractAddresses[chainId as TSupportedNetworks];
      const chainSlug = EASNetworkSlugs[chainId as TSupportedNetworks];

      if (chainSlug) {
        setExplorerUrl(`https://${chainSlug}.easscan.org/`);
      } else {
        setExplorerUrl('');
      }

      if (easContractAddress) {
        setFeedback('');
        onConfigChange({ ...config, easContract: easContractAddress });
      } else {
        setFeedback('Chain is not supported.');
        onConfigChange({ ...config, easContract: '' });
      }
    }
  }, [isConnected, chainId]);

  return (
    <div className={styles.policyConfig}>
      <div className={styles.configField}>
        <label htmlFor='easContract'>EAS Contract</label>
        <input
          type='text'
          id='easContract'
          placeholder='0x...'
          value={config.easContract || ''}
          readOnly={!!config.easContract}
        />
        {feedback && <p className={styles.feedback}>{feedback}</p>}
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
        {explorerUrl && (
          <p className={styles.feedback}>
            Create a new schema or use an existing one from{' '}
            <a href={explorerUrl} target='_blank' rel='noopener noreferrer'>
              {explorerUrl}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default EASPolicyConfig;
