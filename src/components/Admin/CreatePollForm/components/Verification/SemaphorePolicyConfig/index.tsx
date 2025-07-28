import useAppConstants from '@/hooks/useAppConstants';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from '../index.module.css';
import { IPolicyConfigProps } from '../types';

const SemaphorePolicyConfig = ({ config, onConfigChange }: IPolicyConfigProps) => {
  const { isConnected, chainId } = useAccount();
  const [feedback, setFeedback] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);

  const { isChainSupported, contracts } = useAppConstants();

  useEffect(() => {
    if (!isConnected) {
      setFeedback('Connect to wallet to auto-select Semaphore contract.');
      setIsManualInput(false);
      if (!config.semaphoreContract) {
        onConfigChange({ ...config, semaphoreContract: '' });
      }
    } else if (chainId) {
      // Check if the connected chain is supported by Privote
      if (!isChainSupported) {
        setFeedback('Connected chain is not supported by Privote. Please switch to a supported network.');
        setIsManualInput(false);
        onConfigChange({ ...config, semaphoreContract: '' });
        return;
      }

      const semaphoreContract = contracts.semaphore;

      if (semaphoreContract) {
        setFeedback('');
        setIsManualInput(false);
        onConfigChange({ ...config, semaphoreContract });
      } else {
        setFeedback('Semaphore contract not found for this network. Please enter the contract address manually.');
        setIsManualInput(true);
        // Don't clear existing manual input
        if (!config.semaphoreContract) {
          onConfigChange({ ...config, semaphoreContract: '' });
        }
      }
    }
  }, [isConnected, chainId, isChainSupported, contracts.semaphore, config, onConfigChange]);

  return (
    <div className={styles.policyConfig}>
      <div className={styles.configField}>
        <label htmlFor='semaphoreContract'>Semaphore Contract Address</label>
        <input
          type='text'
          id='semaphoreContract'
          placeholder='0x...'
          value={config.semaphoreContract || ''}
          readOnly={!isManualInput && !!config.semaphoreContract}
          onChange={isManualInput ? e => onConfigChange({ ...config, semaphoreContract: e.target.value }) : undefined}
        />
        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </div>
      <div className={styles.configField}>
        <label htmlFor='groupId'>Group Id</label>
        <input
          type='text'
          id='groupId'
          placeholder='0x...'
          value={config.groupId || ''}
          onChange={e => onConfigChange({ ...config, groupId: e.target.value })}
        />
      </div>
    </div>
  );
};

export default SemaphorePolicyConfig;
