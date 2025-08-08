'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAccount, useDisconnect, useConnectors } from 'wagmi';
import { Hooks } from 'porto/wagmi';

type User = { user?: string } | null;

export default function PortoSignInButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const { mutateAsync: connect, isPending } = Hooks.useConnect();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>(null);

  const portoConnector = useMemo(
    () => connectors.find(c => c.id === 'xyz.ithaca.porto'),
    [connectors]
  );

  useEffect(() => {
    // Try to load current session if connected
    (async () => {
      if (!isConnected) return;
      try {
        const res = await fetch('/api/siwe/me/', { credentials: 'include' });
        if (res.ok) setUser(await res.json());
      } catch (error) {
        // ignore
        console.log('error', error);
      }
    })();
  }, [isConnected]);

  const handleSignIn = async () => {
    if (!portoConnector) return;
    
    setLoading(true);
    try {
      // Connect Porto with SIWE
      await connect({
                  connector: portoConnector,
          signInWithEthereum: {
            authUrl: { 
                logout: '/api/siwe/logout/', 
                nonce: '/api/siwe/nonce/', 
                verify: '/api/siwe/verify/', 
              }, 
          }
      });

      // Fetch user after auth completes
      try {
        const res = await fetch('/api/siwe/me/', { credentials: 'include' });
        if (res.ok) setUser(await res.json());
      } catch {
        // ignore
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch('/api/siwe/logout/', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      disconnect();
      setUser(null);
      setLoading(false);
    }
  };

  if (isConnected && address) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        padding: '8px 16px',
        border: '1px solid #333',
        borderRadius: '8px',
        background: '#1a1a1a'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 12, opacity: 0.8, color: '#888' }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {user && (
            <span style={{ fontSize: 10, color: '#4CAF50' }}>
              ✓ Authenticated
            </span>
          )}
        </div>
        <button 
          onClick={handleSignOut} 
          disabled={loading}
          style={{
            padding: '4px 8px',
            fontSize: 12,
            background: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    );
  }

  if (!portoConnector) {
    return (
      <div style={{ 
        padding: '8px 16px',
        background: '#333',
        color: '#888',
        borderRadius: '8px',
        fontSize: 12
      }}>
        Porto not available
      </div>
    );
  }

  return (
    <button 
      onClick={handleSignIn} 
      disabled={loading || isPending}
      style={{
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 500,
        cursor: (loading || isPending) ? 'not-allowed' : 'pointer',
        opacity: (loading || isPending) ? 0.7 : 1
      }}
    >
      {loading || isPending ? 'Connecting…' : 'Sign in with Porto'}
    </button>
  );
}
