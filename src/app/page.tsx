'use client';
import { Hero, Trending } from '@/components/Home';
import { Footer } from '@/components/shared';
import styles from '@/styles/home.module.css';
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className={styles['main-page']}>
      <Hero />
      <Trending />
      <Footer />
    </div>
  );
};

export default Home;
