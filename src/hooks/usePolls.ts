import { GET_POLLS_QUERY } from '@/services/queries/polls';
import type { Poll, RawPoll } from '@/types';
import { PollStatus } from '@/types';
import { fetcher } from '@/utils/fetcher';
import { useInfiniteQuery, type QueryFunctionContext } from '@tanstack/react-query';
import useAppConstants from './useAppConstants';

interface PollsData {
  polls: RawPoll[];
}

interface UsePollsParams {
  searchTerm?: string;
  ownerAddress?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  isTrending?: boolean;
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
    readonly [
      string,
      string,
      string,
      string | undefined,
      string | undefined,
      'asc' | 'desc' | undefined,
      number | undefined,
      boolean | undefined
    ],
    number
  >
): Promise<Poll[]> => {
  const { pageParam, queryKey } = context;
  const [, subgraphUrl, searchTerm, ownerAddress, orderBy, orderDirection, limit, isTrending] = queryKey;

  const where: { name_contains_nocase?: string; owner?: string; endDate_gt?: number; startDate_lt?: number } = {};
  if (searchTerm) {
    where.name_contains_nocase = searchTerm;
  }
  if (ownerAddress) {
    where.owner = ownerAddress;
  }
  if (isTrending) {
    where.endDate_gt = Math.round(Date.now() / 1000);
    where.startDate_lt = Math.round(Date.now() / 1000);
  }

  const variables = {
    first: limit || 10,
    skip: pageParam * (limit || 10),
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: orderBy || 'createdAt',
    orderDirection: orderDirection || 'desc'
  };

  const data: PollsData = await fetcher([subgraphUrl, GET_POLLS_QUERY, variables]);
  return data.polls.map(poll => ({ ...poll, status: getPollStatus(poll) }));
};

const usePolls = ({
  searchTerm = '',
  ownerAddress,
  orderBy,
  orderDirection,
  limit = 10,
  isTrending = false
}: UsePollsParams) => {
  const { subgraphUrl } = useAppConstants();
  return useInfiniteQuery({
    queryKey: ['polls', subgraphUrl, searchTerm, ownerAddress, orderBy, orderDirection, limit, isTrending] as const,
    queryFn: fetchPolls,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length;
    }
  });
};

export default usePolls;
