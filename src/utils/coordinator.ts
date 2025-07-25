import { TCoordinatorServiceResult } from '@/contexts/types';

export default async function makeCoordinatorServicePostRequest<T>(
  url: string,
  body: string
): Promise<TCoordinatorServiceResult<T>> {
  const type = url.split('/').pop() ?? 'finalize';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message
        ? `${response.status} - ${response.statusText}. ${errorData.message}`
        : `${response.status} - ${response.statusText}`;
      return { success: false, error: new Error(`Failed to ${type} proofs: ${errorMessage}`) };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: new Error(`Failed to ${type}: ${error}`)
    };
  }
}
