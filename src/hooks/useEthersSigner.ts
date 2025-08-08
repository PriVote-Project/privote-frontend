import { type Config, useConnectorClient } from 'wagmi';

import { BrowserProvider, JsonRpcSigner, type Eip1193Provider } from 'ethers';
import { useMemo } from 'react';
import type { Account, Chain, Client, Transport } from 'viem';

function wrapTransportAsEip1193Provider(transport: unknown) {
  const t: any = transport as any;
  return {
    request: async ({ method, params }: { method: string; params?: any }) => {
      const normalizedParams =
        params === undefined || (Array.isArray(params) && params.length === 0)
          ? undefined
          : params;
      return t.request({ method, params: normalizedParams });
    },
    on: t.on?.bind(t),
    removeListener: t.removeListener?.bind(t)
  } as unknown as Eip1193Provider;
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };

  const eip1193Provider = wrapTransportAsEip1193Provider(transport);
  const provider = new BrowserProvider(eip1193Provider, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

export default useEthersSigner;