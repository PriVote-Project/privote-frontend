import Link from 'next/link';
import { type PollConfigurationProps } from '../../types';
import WithoutImageInput from '../WithoutImageInput';
import styles from './index.module.css';

const PollConfiguration = ({ setPollConfig, pollConfig, publicKey, handlePubKeyChange }: PollConfigurationProps) => {
  return (
    <div className={styles['poll-config-wrapper']}>
      <h1>Poll Configuration</h1>
      <div className={styles['poll-config']}>
        <div className={styles['config-wrapper']}>
          <div className={styles['config-option']} onClick={() => setPollConfig(1)}>
            <div className={`${styles.dot} ${styles.first} ${pollConfig === 1 ? styles.selected : ''}`}></div>
            <div className={styles['gen-container']}>
              <p className={styles.text}>We dont trust you 🤨, we have coordinator public key</p>
              {pollConfig === 1 && (
                <div className={styles['public-input-container']}>
                  <WithoutImageInput
                    onChange={handlePubKeyChange}
                    value={publicKey}
                    placeholder='macipk.a26f6f713fdf9ab73e2bf57662977f8f4539552b3ca0fb2a65654472427f601b'
                    className={styles['pub-key-input']}
                  />
                  <div className={styles['key-gen']}>
                    You can generate maci key pair from{' '}
                    <Link
                      href='https://maci.pse.dev/docs/core-concepts/maci-keys#generate-maci-keys'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      here
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles['config-wrapper']}>
          <div className={styles['config-option']} onClick={() => setPollConfig(2)}>
            <div className={`${styles.dot} ${pollConfig === 2 ? styles.selected : ''}`}></div>
            <div className={styles['gen-container']}>
              <p className={styles.text}>Use Privote&apos;s trusted Coordinator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollConfiguration;
