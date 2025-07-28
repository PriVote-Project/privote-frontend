import { getResults, type IResult } from '@maci-protocol/sdk/browser';
import { useQuery, type Query } from '@tanstack/react-query';
import useEthersSigner from './useEthersSigner';
import usePollContext from './usePollContext';
import usePrivoteContract from './usePrivoteContract';

const usePollResults = () => {
  const { poll, checkIsTallied } = usePollContext();
  const signer = useEthersSigner();
  const privoteContractAddress = usePrivoteContract()?.address;
  const pollId = poll?.pollId;

  return useQuery({
    enabled: !!signer && !!poll && !!privoteContractAddress,
    queryKey: [
      'get-poll-results',
      {
        pollId: String(pollId),
        signerAddress: signer?.address,
        privoteContractAddress
      }
    ],
    queryFn: async () => {
      let tallied = false;
      let results: IResult[] | undefined = undefined;

      const voteEndDate = Number(poll?.endDate.toString());
      const voteStartDate = Number(poll?.startDate.toString());
      const now = Math.round(Date.now() / 1000);
      const voteEnded = voteEndDate < now;
      let total: bigint = 0n;

      // fetch results only if the vote has ended
      if (voteEnded && signer && pollId) {
        try {
          tallied = await checkIsTallied();
          if (tallied) {
            results = await getResults({
              maciAddress: privoteContractAddress as string,
              pollId: pollId.toString(),
              signer
            });
            total = results.reduce((acc: bigint, cur: IResult) => acc + cur.value, 0n);
          }
        } catch (error) {
          console.log(error);
        }
      }

      return {
        voteStartDate,
        voteEndDate,
        now,
        voteEnded,
        tallied,
        results,
        total
      };
    },
    // refetch every 10 seconds if the vote is not ended
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchInterval: ({ state }: Query<any, any, any, any>) => {
      return state?.data?.voteEnded ? false : 10000;
    },
    refetchOnWindowFocus: true
  });
};

export default usePollResults;
