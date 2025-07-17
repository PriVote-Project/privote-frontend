'use client';
import { useContext } from 'react';
import { PollContext } from '../contexts/PollContext';
import { type IPollContextType } from '../contexts/types';

export const usePollContext = (): IPollContextType => {
  const pollContext = useContext(PollContext);

  if (!pollContext) {
    throw new Error('Should use context inside provider.');
  }

  return pollContext;
};
