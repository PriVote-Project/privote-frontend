'use client';
import { HardhatConfig } from '@/components/PollPublish';
import { usePoll } from '@/hooks/usePoll';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import styles from '~~/styles/publish.module.css';

export default function Publish() {
  const [selected, setSelected] = useState(0);
  const params = useParams();
  const pollAddress = params.id as string;
  const { data: poll, error, isLoading } = usePoll({ pollAddress });

  if (error) {
    return <div>Error loading poll details</div>;
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className='spinner-wrapper'>
          <span className='spinner large'></span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href={'/'} className={styles.back}>
        <Image src='/arrow-left.svg' alt='arrow left' width={27} height={27} />
      </Link>
      <div className={styles.details}>
        <h2 className={styles.heading}>Choose how you want to publish poll results</h2>
        <div className={styles['card-wrapper']}>
          <HardhatConfig
            poll={poll}
            pollId={poll?.pollId as string}
            isSelected={selected === 1}
            onClick={() => setSelected(1)}
          />
        </div>
      </div>
    </div>
  );
}
