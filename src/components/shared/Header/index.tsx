'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from './index.module.css'
import { UserIcon, HomeIcon, PollIcon } from './components'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MdClose } from 'react-icons/md'
import { CiMenuFries } from 'react-icons/ci'
import { Logo } from '../../../../public'

export default function Header() {
  const [isChecked, setIsChecked] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className={styles['header-wrapper']}>
        <header className={styles.header}>
          <div className={styles['content-header']}>
            <Link href="/">
              <div className={styles['header-logo']}>
                <Image src={Logo} alt="logo" width={30} height={30} />
                <p>
                  PRI<span className={styles.highlight}>VOTE</span>
                </p>
              </div>
            </Link>
            <button
              className={styles.hamburger}
              onClick={() => {
                setIsChecked(!isChecked)
              }}
            >
              {isChecked ? (
                <MdClose size={24} color="#fff" />
              ) : (
                <CiMenuFries size={24} color="#fff" />
              )}
            </button>
          </div>
          <div className={`${styles.content} ${isChecked ? styles.checked : ''}`}>
            <nav className={styles.nav}>
              <ul className={styles['nav-list']}>
                <Link href="/" className={`${styles.row} ${pathname === '/' ? styles.active : ''}`}>
                  <HomeIcon />
                  Home
                </Link>
                <Link
                  href="/polls"
                  className={`${styles.row} ${styles.pollRow} ${
                    pathname === '/polls' ? styles.active : ''
                  }`}
                >
                  <PollIcon />
                  Polls
                </Link>
                <Link
                  href="/admin"
                  className={`${styles.row} ${pathname === '/admin' ? styles.active : ''}`}
                >
                  <UserIcon />
                  Admin
                </Link>
              </ul>
            </nav>
            <div className={styles.actions}>
              <ConnectButton />
            </div>
          </div>
        </header>
      </div>
    </>
  )
}
