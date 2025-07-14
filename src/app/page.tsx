'use client'
import React from 'react'
import styles from '@/styles/page.module.css'
import { Hero, Trending } from '@/components/Home'
import { Footer } from '@/components/shared'

const Home: React.FC = () => {
  return (
    <div className={styles['main-page']}>
      <Hero />
      <Trending />
      <Footer />
    </div>
  )
}

export default Home
