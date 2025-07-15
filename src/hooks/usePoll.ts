import { client } from '@/lib/graphql';
import { GET_POLL_QUERY } from '@/services/queries/polls';
import type { RawPoll, TransformedPoll } from '@/types';
import { EMode, PollType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getPollStatus } from './usePolls';

// Map numeric indices back to string types
const pollTypeIndexToString: Record<number, keyof typeof PollType> = {
  0: 'NOT_SELECTED',
  1: 'SINGLE_VOTE',
  2: 'MULTIPLE_VOTE',
  3: 'WEIGHTED_MULTIPLE_VOTE'
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

export const usePoll = ({ pollAddress }: UsePollParams) => {
  return useQuery<TransformedPoll | null>({
    queryKey: ['poll', pollAddress],
    queryFn: async () => {
      if (!pollAddress) return null;

      try {
        const data: PollData = await client.request(GET_POLL_QUERY, {
          id: pollAddress
        });

        if (!data.poll) return null;

        // Convert numeric indices to string constants
        const pollTypeString = getPollTypeString(Number(data.poll.pollType));
        const modeString = getEModeString(Number(data.poll.mode));

        // Create the transformed poll with the correct types and values
        const transformedPoll: TransformedPoll = {
          ...data.poll,
          status: getPollStatus(data.poll),
          pollType: pollTypeString,
          mode: modeString,
          totalSignups: data.poll.totalSignups,
          maxVotePerPerson: data.poll.maxVotePerPerson
        };

        return transformedPoll;
      } catch (error) {
        console.error('Error fetching poll details:', error);
        throw error;
      }
    },
    enabled: !!pollAddress,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
