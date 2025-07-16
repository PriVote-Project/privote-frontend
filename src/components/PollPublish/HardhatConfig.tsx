import { EMode, TransformedPoll } from '@/types';
import { useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import styles from '~~/styles/publish.module.css';

interface HardhatConfigProps {
  poll?: TransformedPoll | null;
  isSelected: boolean;
  onClick: () => void;
  pollId: string;
}

const CommandBlock = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.commandBlock}>
      <pre className={styles.commandText}>{command}</pre>
      <button className={styles.copyButton} onClick={copyToClipboard} title={copied ? 'Copied!' : 'Copy to clipboard'}>
        {copied ? <FiCheck /> : <FiCopy />}
      </button>
    </div>
  );
};

export const HardhatConfig = ({ poll, pollId, isSelected, onClick }: HardhatConfigProps) => {
  const { isConnected, chain } = useAccount();

  const modeValues = {
    [EMode.QV]: 0,
    [EMode.NON_QV]: 1,
    [EMode.FULL]: 2
  };

  return (
    <div className={styles['config-wrapper']}>
      <div className={styles['config-option']} onClick={onClick}>
        <div className={`${styles.dot} ${isSelected ? styles.selected : ''}`}></div>
        <div className={styles['gen-container']}>
          <p className={styles['config-heading']}>Generate results Locally</p>
          {isSelected && (
            <>
              <div className={styles.instructionsContainer}>
                <div className={styles.stepBlock}>
                  <h3 className={styles.stepTitle}>Step 1: Clone and Setup</h3>
                  <CommandBlock command='git clone https://github.com/PriVote-Project/privote-contracts.git' />
                  <CommandBlock command='cd privote-contracts' />
                  <CommandBlock command='yarn install' />
                  <CommandBlock command='yarn download-zkeys' />
                </div>

                <div className={styles.stepBlock}>
                  <h3 className={styles.stepTitle}>Step 2: Generate Results</h3>
                  <p className={styles.stepDescription}>
                    Replace <code>&lt;private-key&gt;</code> with your coordinator's private key generated while
                    creating the poll.
                  </p>
                  <CommandBlock
                    command={`yarn hardhat prove --poll ${pollId} --mode ${modeValues[poll?.mode as EMode]} --output-dir ./proofs --tally-file ./tally.json --network ${
                      isConnected ? chain?.name?.toLowerCase() : 'arbitrum-sepolia'
                    } --submit-on-chain true --coordinator-private-key <private-key>`}
                  />
                </div>
                {/* <div className={styles.stepBlock}>
                  <h3 className={styles.stepTitle}>Step 3: Submit onchain</h3>
                  <CommandBlock
                    command={`yarn hardhat submitOnChain --poll ${pollId} --output-dir ./proofs --tally-file ./tally.json --network ${
                      isConnected ? chain?.name?.toLowerCase() : 'arbitrum-sepolia'
                    }`}
                  />
                </div> */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HardhatConfig;
