import { supportedChains, transports } from '@/config/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, rainbowWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig } from 'wagmi';

export const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [injectedWallet, rainbowWallet]
    },
    {
      groupName: 'Other',
      wallets: [rainbowWallet]
    }
  ],
  {
    appName: 'Privote',
    projectId: 'ed72cdc1d051302a6b881988c7a991fb'
  }
);

export const config = createConfig({
  connectors,
  chains: supportedChains,
  transports: transports
});
