import { useCallback, useState } from 'react';
import { keccak256 } from 'viem';
import { useSignMessage } from 'wagmi';

interface PollSeedJWTData {
  exists: boolean;
  signatureSeed?: string;
  expiresAt?: string;
}

export const usePollSeedJWT = () => {
  const [loading, setLoading] = useState(false);
  const { signMessageAsync } = useSignMessage();

  // Get existing seed JWT for a poll
  const getPollSeedJWT = useCallback(async (pollId: string): Promise<PollSeedJWTData> => {
    try {
      const response = await fetch(`/api/poll/seedJWT/?pollId=${pollId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        // If unauthorized or poll seed doesn't exist, return false
        if (response.status === 401 || response.status === 404) {
          return { exists: false };
        }
        console.warn(`Poll seed JWT API returned ${response.status}`);
        return { exists: false };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting poll seed JWT:', error);
      return { exists: false };
    }
  }, []);

  // Create new seed JWT for a poll
  const createPollSeedJWT = useCallback(async (
    pollId: string, 
    pollEndDate: string
  ): Promise<{ success: boolean; signatureSeed?: string }> => {
    setLoading(true);
    try {
      // Create a poll-specific signature message
      const message = `Generate MACI keypair for poll ${pollId}. This signature will be used to create your voting key for this poll only.`;
      
      // Sign the message
      const signature = await signMessageAsync({ message });
      
      // Create deterministic seed from signature
      const signatureSeed = keccak256(signature);

      // Send to API to create JWT
      const response = await fetch('/api/poll/seedJWT/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          pollId,
          pollEndDate,
          signatureSeed
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to create poll seed JWT:', response.status, errorData);
        return { success: false };
      }

      const result = await response.json();
      return { 
        success: result.success, 
        signatureSeed: result.success ? signatureSeed : undefined 
      };

    } catch (error) {
      console.error('Error creating poll seed JWT:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [signMessageAsync]);

  // Get or create seed JWT for a poll
  const getOrCreatePollSeedJWT = useCallback(async (
    pollId: string, 
    pollEndDate: string
  ): Promise<{ signatureSeed?: string; isNew: boolean }> => {
    // First try to get existing
    const existing = await getPollSeedJWT(pollId);
    
    if (existing.exists && existing.signatureSeed) {
      return { 
        signatureSeed: existing.signatureSeed, 
        isNew: false 
      };
    }

    // Create new one
    const created = await createPollSeedJWT(pollId, pollEndDate);
    
    return { 
      signatureSeed: created.signatureSeed, 
      isNew: true 
    };
  }, [getPollSeedJWT, createPollSeedJWT]);

  return {
    loading,
    getPollSeedJWT,
    createPollSeedJWT,
    getOrCreatePollSeedJWT
  };
};
