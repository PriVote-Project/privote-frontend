import Link from 'next/link'
import styles from './index.module.css'
import { Button } from '@/components/shared'
import { useSigContext } from '@/contexts/SigContext'

interface HeroProps {
  title?: string
  description?: string
  status?: string
}

export const Hero = ({
  title = 'Revolutionizing the Future of Voting',
  description = 'Create polls, participate in elections, and make your voice heard in a Private and Decentralized way.',
  status = 'Privote: The all new way of voting through'
}: HeroProps) => {
  const { isRegistered, onSignup, isLoading, error, maciKeypair } = useSigContext()

  console.log(maciKeypair?.publicKey.serialize())

  return (
    <div className={styles.hero}>
      <div className={styles.status}>
        {status}{' '}
        <Link href={'https://maci.pse.dev/'} target="_blank" rel="noopener noreferrer">
          MACI
        </Link>
      </div>
      <h1 className={styles.heading}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        {!isRegistered && (
          <Button action={onSignup} disabled={isLoading}>
            <p>Register</p>
          </Button>
        )}
        <Link className={styles['create-poll']} href="/admin/?action=create">
          <p>Create Poll</p>
        </Link>
      </div>
      <div className={styles['error-message']}>{error ? error : ''}</div>
    </div>
  )
}

export default Hero
