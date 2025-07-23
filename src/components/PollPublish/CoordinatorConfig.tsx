import { FinalizeStatus } from '@/contexts/types';
import useCoordinatorContext from '@/hooks/userCoordinatorContext';
import styles from '@/styles/publish.module.css';
import { useEffect, useState } from 'react';
import { WithoutImageInput } from '../Admin/CreatePollForm/components';
import FinalizeLoader, { btnTextMap } from './FinalizePollLoader';

interface CoordinatorConfigProps {
  isSelected: boolean;
  onClick: () => void;
}

const CoordinatorConfig = ({ isSelected, onClick }: CoordinatorConfigProps) => {
  const [finalizeStatus, setFinalizeStatus] = useState<FinalizeStatus>('notStarted');
  const { privKey, setPrivKey, finalizePoll } = useCoordinatorContext();
  const [isModalVisible, setIsModalVisible] = useState(true);

  const showLoader = isModalVisible && finalizeStatus !== 'notStarted';

  // update isModalVisible everytime status changes from 'notStarted'
  useEffect(() => {
    if (!isModalVisible && finalizeStatus === 'notStarted') {
      setIsModalVisible(true);
    }
  }, [finalizeStatus, isModalVisible]);

  return (
    <div className={styles['config-wrapper']}>
      <div className={styles['config-option']} onClick={onClick}>
        <div className={`${styles.dot} ${isSelected ? styles.selected : ''}`}></div>
        <div className={styles['gen-container']}>
          <p className={styles['config-heading']}>
            Use Privote&apos;s Coordinator Services (trust us we&apos;re good 🙂)
          </p>
          {isSelected && (
            <div className={styles['public-input-container']}>
              <p className={`${styles['bg-card']} ${styles.text}`}>
                Use Privote&apos;s backend services to publish results
              </p>
              <WithoutImageInput
                placeholder='Enter Coordinator private key...'
                value={privKey}
                onChange={e => setPrivKey(e.target.value)}
                name='privKey'
                className={styles['public-input']}
              />
              <button
                className={styles['publish-btn']}
                disabled={showLoader}
                onClick={() => finalizePoll({ setFinalizeStatus })}
              >
                {btnTextMap[finalizeStatus]}
              </button>
            </div>
          )}
        </div>
      </div>
      <FinalizeLoader isOpen={showLoader} status={finalizeStatus} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default CoordinatorConfig;
