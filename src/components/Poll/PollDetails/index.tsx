import PollHeader from '../PollHeader';
import VotingSection from '../VotingSection';
import styles from './index.module.css';

interface IPollDetails {
  pollAddress: string;
}

const PollDetails = ({ pollAddress }: IPollDetails) => {
  return (
    <div className={styles['poll-details']}>
      <PollHeader />
      <VotingSection pollAddress={pollAddress} />
    </div>
  );
};

export default PollDetails;
