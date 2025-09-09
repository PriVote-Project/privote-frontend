import { ICreatePollSeedJWTData, IPollSeedJWTData } from '@/types/porto';
import { Hex } from 'viem';
import { generateSiweNonce } from 'viem/siwe';

export async function verify(message: string, signature: Hex) {
  try {
    const response = await fetch(`/api/siwe/verify`, {
      method: 'POST',
      body: JSON.stringify({ message, signature })
    });

    if (!response.ok) {
      throw new Error('Failed to verify SIWE message');
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function getPollSeedJWT(pollId: string): Promise<IPollSeedJWTData> {
  try {
    const response = await fetch(`/api/poll/seedJWT?pollId=${pollId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        return { exists: false };
      }
      console.warn(`Poll seed JWT API returned ${response.status}`);
      return { exists: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting poll seed JWT:', error);
    return { exists: false };
  }
}

export async function createPollSeedJWT(
  pollId: string,
  pollEndDate: string,
  signatureSeed: Hex
): Promise<ICreatePollSeedJWTData> {
  try {
    const response = await fetch('/api/poll/seedJWT/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
  }
}

export async function getNonce() {
  try {
    const response = await fetch('/api/siwe/nonce');
    if (!response.ok) {
      throw new Error('Failed to get nonce');
    }

    return (await response.json()).nonce;
  } catch (error) {
    console.error('Error getting nonce:', error);
    return generateSiweNonce();
  }
}
