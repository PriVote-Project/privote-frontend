import { GET_POLL_QUERY } from '@/services/queries/polls';
import type { RawPoll, TransformedPoll } from '@/types';
import { EMode, PollType } from '@/types';
import { fetcher } from '@/utils/fetcher';
import { useQuery } from '@tanstack/react-query';
import useAppConstants from './useAppConstants';
import { getPollStatus } from './usePolls';
import { Hex } from 'viem';

// Map numeric indices back to string types
const pollTypeIndexToString: Record<number, keyof typeof PollType> = {
  0: 'NOT_SELECTED',
  1: 'SINGLE_VOTE',
  2: 'MULTIPLE_VOTE'
};

// Map numeric indices back to string modes
const eModeIndexToString: Record<number, keyof typeof EMode> = {
  0: 'QV',
  1: 'NON_QV',
  2: 'FULL'
};

// Convert a numeric poll type to its string representation
export function getPollTypeString(pollTypeIndex: number): PollType {
  return pollTypeIndexToString[pollTypeIndex] || 'NOT_SELECTED';
}

// Convert a numeric mode to its string representation
export function getEModeString(modeIndex: number): EMode {
  return eModeIndexToString[modeIndex] || 'QV';
}

interface PollData {
  poll: RawPoll;
}

interface UsePollParams {
  pollAddress: string | null | undefined;
}

const usePoll = ({ pollAddress }: UsePollParams) => {
  const { subgraphUrl } = useAppConstants();
  return useQuery<TransformedPoll | null>({
    queryKey: ['poll', pollAddress],
    queryFn: async () => {
      if (!pollAddress) return null;

      // Try to fetch from all supported subgraphs if the primary one fails
      const tryFetchFromSubgraph = async (url: string): Promise<PollData | null> => {
        try {
          const data: PollData = await fetcher([
            url,
            GET_POLL_QUERY,
            {
              id: pollAddress
            }
          ]);
          return data.poll ? data : null;
        } catch (error) {
          console.warn(`Failed to fetch poll from ${url}:`, error);
          return null;
        }
      };

      // First try the primary subgraph URL
      let data = await tryFetchFromSubgraph(subgraphUrl);

      // If not found and we're using a specific chain, try all other chains
      if (!data?.poll) {
        // Generate all possible subgraph URLs
        const { supportedChains } = await import('@/config/chains');
        const { appConstants } = await import('@/config/constants');
        const { SUBGRAPH_PROJECT_ID, SUBGRAPH_VERSION } = await import('@/utils/constants');

        for (const chain of supportedChains) {
          const chainConstants = appConstants[chain.id];
          const alternativeUrl = `https://api.goldsky.com/api/public/${SUBGRAPH_PROJECT_ID}/subgraphs/privote-${chainConstants.slugs.subgraph}/${SUBGRAPH_VERSION}/gn`;

          // Skip if this is the same URL we already tried
          if (alternativeUrl === subgraphUrl) continue;

          data = await tryFetchFromSubgraph(alternativeUrl);
          if (data?.poll) {
            console.log(`Poll found on ${chain.name} subgraph`);
            break;
          }
        }
      }

      if (!data?.poll) {
        throw new Error(`Poll not found on any supported network. Poll address: ${pollAddress}`);
      }

      // Convert numeric indices to string constants
      const pollTypeString = getPollTypeString(Number(data.poll.pollType));
      const modeString = getEModeString(Number(data.poll.mode));
      const pubKey = data.poll.coordinatorPublicKey;

      // Create the transformed poll with the correct types and values
      const transformedPoll: TransformedPoll = {
        ...data.poll,
        status: getPollStatus(data.poll),
        pollType: pollTypeString,
        mode: modeString,
        coordinatorPublicKey: pubKey ? [BigInt(pubKey[0]), BigInt(pubKey[1])] : undefined,
        privoteContractAddress: data.poll.maci.id as Hex
      };

      return transformedPoll;
    },
    enabled: !!pollAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3, // Retry failed requests
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000) // Exponential backoff
  });
};

export default usePoll;
