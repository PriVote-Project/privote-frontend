'use client';

import SigContextProvider from '@/contexts/SigContext';
import { ReactNode } from 'react';

interface PollSigContextWrapperProps {
  children: ReactNode;
  pollId: string;
  pollEndDate: string;
}

/**
 * Wrapper component that provides poll-specific SigContext
 * Use this in poll pages to enable poll-specific MACI keypairs
 */
export default function PollSigContextWrapper({ 
  children, 
  pollId, 
  pollEndDate 
}: PollSigContextWrapperProps) {
  return (
    <SigContextProvider pollId={pollId} pollEndDate={pollEndDate}>
      {children}
    </SigContextProvider>
  );
}
