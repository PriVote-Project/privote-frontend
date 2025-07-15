import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import type { PollOption, TransformedPoll } from '@/types';
import { useAccount } from 'wagmi';
import deployedContracts from '@/contracts/deployedContracts';

interface IResult {
  candidate: string;
  votes: number;
}

interface UsePollResultsReturn {
  result: IResult[] | null;
  totalVotes: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const usePollResults = (poll: TransformedPoll | null | undefined): UsePollResultsReturn => {
  const [result, setResult] = useState<IResult[] | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // const { chainId } = useAccount()
  // const {
  //   data: tally,
  //   isLoading: pollTallyLoading,
  //   error: pollTallyError
  // } = useReadContract({
  //   abi: deployedContracts[chainId as keyof typeof deployedContracts]?.privote?.abi,
  //   address: poll?.id as `0x${string}`,
  //   functionName: 'getPollResult',
  //   args: [BigInt(poll?.pollId || 0)]
  // })

  // console.log(pollTallyError)

  // const fetchResults = async () => {
  //   if (!poll || !tally) return

  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     if (!poll.options || poll.options.length > tally.length) {
  //       throw new Error('Invalid tally data')
  //     }

  //     const tallyCounts: number[] = tally
  //       .map((v: bigint) => Number(v))
  //       .slice(0, poll.options.length)

  //     const results = poll.options.map((value: PollOption, i: number) => ({
  //       candidate: value.name,
  //       votes: tallyCounts[i]
  //     }))

  //     results.sort((a: IResult, b: IResult) => b.votes - a.votes)
  //     const total = results.reduce((acc: number, cur: IResult) => acc + cur.votes, 0)

  //     setResult(results)
  //     setTotalVotes(total)
  //   } catch (err) {
  //     setError(err instanceof Error ? err : new Error('Failed to fetch results'))
  //     console.error('Error fetching poll results:', err)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchResults()
  // }, [tally])

  return {
    result,
    totalVotes,
    isLoading,
    error,
    refetch: () => {}
  };
};

export default usePollResults;
