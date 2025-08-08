'use client';
import AppConstantsProvider from '@/contexts/AppConstantsContext';
import FaucetContextProvider from '@/contexts/FaucetContext';
import SigContextProvider from '@/contexts/SigContext';
import { AnonAadhaarProvider } from '@anon-aadhaar/react';
import { RainbowKitProvider, midnightTheme, type Theme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import merge from 'lodash.merge';
import { Toaster } from 'react-hot-toast';
import { http, WagmiProvider } from 'wagmi';
import BlockieAvatar from '../BlockieAvatar';
import { config } from './wagmi';
import { Porto } from 'porto';

import '@rainbow-me/rainbowkit/styles.css';
import { base } from 'wagmi/chains';

// Inject Porto via EIP-6963 so it is discoverable by RainbowKit/Wagmi
Porto.create(
  {
    authUrl: '/api/siwe'
  }
);

const queryClient = new QueryClient();

const customTheme: Theme = merge(midnightTheme(), {
  colors: {
    accentColor: '#c65ec6',
    accentColorForeground: 'white',
    connectButtonText: '#ffffff',
    connectButtonBackground: '#7f58b7'
  },
  radii: {
    actionButton: 30
  }
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme} avatar={BlockieAvatar}>
          <AnonAadhaarProvider _useTestAadhaar>
            <AppConstantsProvider>
              <FaucetContextProvider>
                <SigContextProvider>
                  {children}
                  <Toaster />
                </SigContextProvider>
              </FaucetContextProvider>
            </AppConstantsProvider>
          </AnonAadhaarProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
