import { client } from '@/lib/graphql';
import { GET_POLLS_QUERY } from '@/services/queries/polls';
import type { Poll, RawPoll } from '@/types';
import { PollStatus } from '@/types';
import { useInfiniteQuery, type QueryFunctionContext } from '@tanstack/react-query';

interface PollsData {
  polls: RawPoll[];
}

interface UsePollsParams {
  searchTerm?: string;
  ownerAddress?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
}

export function getPollStatus(poll: RawPoll): PollStatus {
  const now = Math.round(new Date().getTime() / 1000);
  const startTime = parseInt(poll.startDate, 10);
  const endTime = parseInt(poll.endDate, 10);

  if (startTime > now) {
    return PollStatus.NOT_STARTED;
  }

  if (endTime > now) {
    return PollStatus.OPEN;
  }

  return PollStatus.CLOSED;
}

const fetchPolls = async (
  context: QueryFunctionContext<
    readonly [string, string, string | undefined, string | undefined, 'asc' | 'desc' | undefined, number | undefined],
    number
  >
): Promise<Poll[]> => {
  const { pageParam, queryKey } = context;
  const [, searchTerm, ownerAddress, orderBy, orderDirection, limit] = queryKey;

  const where: { name_contains_nocase?: string; owner?: string } = {};
  if (searchTerm) {
    where.name_contains_nocase = searchTerm;
  }
  if (ownerAddress) {
    where.owner = ownerAddress;
  }

  const variables = {
    first: limit || 10,
    skip: pageParam * (limit || 10),
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: orderBy || 'createdAt',
    orderDirection: orderDirection || 'desc'
  };

  const data: PollsData = await client.request(GET_POLLS_QUERY, variables);
  return data.polls.map(poll => ({ ...poll, status: getPollStatus(poll) }));
};

export const usePolls = ({ searchTerm = '', ownerAddress, orderBy, orderDirection, limit }: UsePollsParams) => {
  return useInfiniteQuery({
    queryKey: ['polls', searchTerm, ownerAddress, orderBy, orderDirection, limit] as const,
    queryFn: fetchPolls,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length;
    }
  });
};
