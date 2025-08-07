'use client';
import useAppConstants from '@/hooks/useAppConstants';
import useEthersSigner from '@/hooks/useEthersSigner';
import useFaucetContext from '@/hooks/useFaucetContext';
import usePrivoteContract from '@/hooks/usePrivoteContract';
import { DEFAULT_SG_DATA, ONE_HOUR_MS } from '@/utils/constants';
import { handleNotice, notification } from '@/utils/notification';
import { getSignedupUserData } from '@/utils/subgraph';
import { Keypair, PrivateKey } from '@maci-protocol/domainobjs';
import { signup } from '@maci-protocol/sdk/browser';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { keccak256 } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';

interface ISigContext {
  maciKeypair: Keypair | null;
  isRegistered: boolean;
  stateIndex: string | undefined;
  isLoading: boolean;
  error: string | undefined;
  generateKeypair: () => void;
  deleteKeypair: () => void;
  onSignup: () => Promise<void>;
}

export const SigContext = createContext<ISigContext>({} as ISigContext);

export default function SigContextProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [maciKeypair, setMaciKeypair] = useState<Keypair | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [stateIndex, setStateIndex] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { signMessageAsync } = useSignMessage();
  const signer = useEthersSigner();
  const privoteContract = usePrivoteContract();
  const { subgraphUrl } = useAppConstants();
  const { checkBalance } = useFaucetContext();

  // constants
  const CACHE_EXPIRY_HOURS = 72;
  const appName = 'PRIVOTE';
  const purpose = 'This signature will be used to generate your secure MACI private key.';
  const signatureMessage = `Welcome to ${appName}! ${purpose}`;

  // Function to load keypair from localStorage
  const loadKeypairFromLocalStorage = useCallback(() => {
    if (!address) return null;

    const storageKey = `maciKeypair-${address}`;
    try {
      const storedKeypair = window.localStorage.getItem(storageKey);
      if (storedKeypair) {
        // parse the stored keypair
        const { privateKey, timestamp } = JSON.parse(storedKeypair);

        // check if privateKey & timestamp are valid
        if (!PrivateKey.isValidSerialized(privateKey) || !timestamp) {
          console.log('Invalid private key, clearing cache');
          window.localStorage.removeItem(storageKey);
          return null;
        }

        // check if the cache has expired
        const now = Date.now();
        const expiryTime = timestamp + CACHE_EXPIRY_HOURS * ONE_HOUR_MS;
        if (now > expiryTime) {
          console.log('Cached artifacts expired, clearing cache');
          window.localStorage.removeItem(storageKey);
          return null;
        }

        // return the keypair
        return new Keypair(PrivateKey.deserialize(privateKey));
      }
    } catch (error) {
      console.error('Error reading keypair from localStorage:', error);
    }
    return null;
  }, [address]);

  // Function to save keypair to localStorage
  const saveKeypairToLocalStorage = useCallback(
    (keypair: Keypair) => {
      if (!address) return;

      const storageKey = `maciKeypair-${address}`;
      try {
        const privateKeyHex = keypair.privateKey.serialize();
        const localKey = {
          privateKey: privateKeyHex,
          timestamp: Date.now()
        };
        window.localStorage.setItem(storageKey, JSON.stringify(localKey));
      } catch (error) {
        console.error('Error saving keypair to localStorage:', error);
      }
    },
    [address]
  );

  const generateKeypair = useCallback(async () => {
    if (!address) return null;

    try {
      const signature = await signMessageAsync({ message: signatureMessage });
      const seed = keccak256(signature);
      const userKeyPair = new Keypair(new PrivateKey(BigInt(seed)));

      // Save to localStorage
      saveKeypairToLocalStorage(userKeyPair);
      setMaciKeypair(userKeyPair);

      return userKeyPair;
    } catch (err) {
      console.error('Error generating keypair:', err);
      return null;
    }
  }, [address, signMessageAsync, signatureMessage, saveKeypairToLocalStorage]);

  const deleteKeypair = useCallback(() => {
    if (!address) return;

    const storageKey = `maciKeypair-${address}`;
    try {
      window.localStorage.removeItem(storageKey);
      setMaciKeypair(null);
    } catch (error) {
      console.error('Error deleting keypair from localStorage:', error);
    }
  }, [address]);

  const onSignup = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);

    if (!isConnected) {
      setError('Wallet not connected');
      setIsLoading(false);

      notification.error('Wallet not connected');
      return;
    }

    if (isRegistered) {
      setError('Already registered');
      setIsLoading(false);

      notification.error('Already registered');
      return;
    }

    if (!privoteContract) {
      setError('Privote contract not found');
      setIsLoading(false);

      notification.error('Privote contract not found! Connect to a supported chain');
      return;
    }

    if (!signer) {
      setError('Signer not found');
      setIsLoading(false);

      notification.error('Signer not found');
      return;
    }

    if (checkBalance()) {
      setIsLoading(false);
      return;
    }

    let keypair = maciKeypair;
    if (!keypair) {
      try {
        keypair = (await generateKeypair()) as Keypair;
      } catch (error) {
        setError('Error creating keypair');
        setIsLoading(false);

        notification.error('Error creating keypair');
        console.log('Error creating keypair:', error);
        return;
      }
    }

    let notificationId = notification.loading('Checking if user is registered...');

    let isUserRegistered = false;
    try {
      const { isRegistered: _isRegistered } = await getSignedupUserData(subgraphUrl, keypair);

      isUserRegistered = _isRegistered;
      setIsRegistered(_isRegistered);
    } catch (error) {
      setError('Error checking if user is registered');
      setIsLoading(false);

      handleNotice({
        message: 'Error checking if user is registered',
        type: 'error',
        id: notificationId
      });
      console.log('Error checking if user is registered:', error);
      return;
    }

    if (isUserRegistered) {
      setIsLoading(false);
      handleNotice({
        message: "You're already signed up to MACI contract",
        type: 'success',
        id: notificationId
      });
      return;
    }

    notificationId = handleNotice({
      message: 'Signing up...',
      type: 'loading',
      id: notificationId
    });
    try {
      const { stateIndex: _stateIndex } = await signup({
        maciAddress: privoteContract.address,
        maciPublicKey: maciKeypair?.publicKey.serialize() as string,
        sgData: DEFAULT_SG_DATA,
        signer
      });
      setStateIndex(_stateIndex);
      setIsRegistered(true);
      setIsLoading(false);
      notificationId = handleNotice({
        message: 'Signed up to PRIVOTE contract',
        type: 'success',
        id: notificationId
      });
    } catch (error) {
      console.log('Signup error', error);
      setError('Error signing up');
      setIsLoading(false);
      handleNotice({
        message: 'Error signing up',
        type: 'error',
        id: notificationId
      });
    }
  }, [isConnected, isRegistered, maciKeypair, signer, privoteContract, generateKeypair, subgraphUrl]);

  useEffect(() => {
    // Reset keypair when wallet disconnects
    if (!address) {
      setMaciKeypair(null);
      return;
    }

    // Try to load existing keypair from localStorage
    const existingKeypair = loadKeypairFromLocalStorage();
    if (existingKeypair) {
      setMaciKeypair(existingKeypair);
    } else {
      setMaciKeypair(null);
      generateKeypair();
    }
  }, [address, loadKeypairFromLocalStorage, generateKeypair]);

  // check if user is registered
  useEffect(() => {
    (async () => {
      if (!isConnected) {
        setIsRegistered(false);
        return;
      }

      if (!maciKeypair) {
        setIsRegistered(false);
        setStateIndex(undefined);
        return;
      }

      try {
        const { isRegistered: _isRegistered, stateIndex: _stateIndex } = await getSignedupUserData(
          subgraphUrl,
          maciKeypair
        );

        setIsRegistered(_isRegistered);
        setStateIndex(_stateIndex);
      } catch (error) {
        console.log(error);
        setIsRegistered(false);
      }
    })();
  }, [maciKeypair, isConnected, subgraphUrl]);

  return (
    <SigContext.Provider
      value={{
        maciKeypair,
        isRegistered,
        stateIndex,
        isLoading,
        error,
        generateKeypair,
        deleteKeypair,
        onSignup
      }}
    >
      {children}
    </SigContext.Provider>
  );
}

export const useSigContext = () => useContext(SigContext);
