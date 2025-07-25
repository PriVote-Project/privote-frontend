import { FinalizeStatus } from '@/contexts/types';
import useCoordinatorContext from '@/hooks/userCoordinatorContext';
import styles from '@/styles/publish.module.css';
import { useEffect, useState } from 'react';
import FinalizeLoader, { btnTextMap } from './FinalizePollLoader';

interface CoordinatorConfigProps {
  isSelected: boolean;
  onClick: () => void;
}

const CoordinatorConfig = ({ isSelected, onClick }: CoordinatorConfigProps) => {
  const [finalizeStatus, setFinalizeStatus] = useState<FinalizeStatus>('notStarted');
  const { finalizePoll } = useCoordinatorContext();
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
                Use Privote&apos;s trusted coordinator service to publish results
              </p>
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
