import { supportedChains, transports } from '@/config/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, rainbowWallet } from '@rainbow-me/rainbowkit/wallets';
import { porto } from 'porto/wagmi';
import { createConfig } from 'wagmi';

// Custom passkey connector ( uses porto connector )
const passkeyConnector = (config: any) => {
  const connector = porto()(config);

  // Override the read-only name and id properties
  Object.defineProperty(connector, 'name', {
    value: 'Passkey',
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(connector, 'id', {
    value: 'Passkey',
    writable: false,
    enumerable: true,
    configurable: true
  });

  return connector;
};

export const connectors = [
  passkeyConnector,
  ...connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [injectedWallet]
      },
      {
        groupName: 'Popular',
        wallets: [rainbowWallet]
      }
    ],
    {
      appName: 'Privote',
      projectId: 'ed72cdc1d051302a6b881988c7a991fb'
    }
  )
];

export const config = createConfig({
  connectors,
  chains: supportedChains,
  transports: transports
});
