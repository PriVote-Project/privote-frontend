import { ESupportedNetworks } from '@/types/chains';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { GitcoinDecoderAddresses } from '../constants';
import styles from '../index.module.css';
import { IPolicyConfigProps } from '../types';

const GitcoinPolicyConfig = ({ config, onConfigChange }: IPolicyConfigProps) => {
  const { isConnected, chainId } = useAccount();
  const [feedback, setFeedback] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setFeedback('Connect to wallet to auto-select Gitcoin decoder contract.');
      setIsManualInput(false);
      if (!config.gitcoinDecoderAddress) {
        onConfigChange({ ...config, gitcoinDecoderAddress: '' });
      }
    } else if (chainId) {
      // Check if the connected chain is supported by Privote
      const isChainSupported = chainId in ESupportedNetworks;

      if (!isChainSupported) {
        setFeedback('Connected chain is not supported by Privote. Please switch to a supported network.');
        setIsManualInput(false);
        onConfigChange({ ...config, gitcoinDecoderAddress: '' });
        return;
      }

      const gitcoinDecoderAddress = GitcoinDecoderAddresses[chainId as keyof typeof GitcoinDecoderAddresses];

      if (gitcoinDecoderAddress) {
        setFeedback('');
        setIsManualInput(false);
        onConfigChange({ ...config, gitcoinDecoderAddress });
      } else {
        setFeedback('Gitcoin decoder contract not found for this network. Please enter the contract address manually.');
        setIsManualInput(true);
        // Don't clear existing manual input
        if (!config.gitcoinDecoderAddress) {
          onConfigChange({ ...config, gitcoinDecoderAddress: '' });
        }
      }
    }
  }, [isConnected, chainId]);

  return (
    <div className={styles.policyConfig}>
      <div className={styles.configField}>
        <label htmlFor='gitcoinDecoderAddress'>Gitcoin Decoder Address</label>
        <input
          type='text'
          id='gitcoinDecoderAddress'
          placeholder='0x...'
          value={config.gitcoinDecoderAddress || ''}
          readOnly={!isManualInput && !!config.gitcoinDecoderAddress}
          onChange={
            isManualInput ? e => onConfigChange({ ...config, gitcoinDecoderAddress: e.target.value }) : undefined
          }
        />
        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </div>
      <div className={styles.configField}>
        <label htmlFor='passingScore'>Passing Score</label>
        <input
          type='text'
          id='passingScore'
          placeholder='0x...'
          value={config.passingScore || ''}
          onChange={e => onConfigChange({ ...config, passingScore: e.target.value })}
        />
      </div>
    </div>
  );
};

export default GitcoinPolicyConfig;
