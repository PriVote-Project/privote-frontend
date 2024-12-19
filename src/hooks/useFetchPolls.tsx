import { useEffect, useState } from "react";
import { useScaffoldContractRead } from "./scaffold-eth";
import { Poll, PollStatus, RawPoll } from "~~/types/poll";

export function getPollStatus(poll: RawPoll) {
  const now = Math.round(new Date().getTime() / 1000);

  if (poll.startTime > BigInt(now)) {
    return PollStatus.NOT_STARTED;
  }

  if (poll.endTime > BigInt(now)) {
    return PollStatus.OPEN;
  }

  if (!poll.tallyJsonCID) {
    return PollStatus.CLOSED;
  }

  return PollStatus.RESULT_COMPUTED;
}

export const useFetchPolls = (
  currentPage = 1,
  limit = 25,
  reversed = true,
  address = ""
) => {
  const [polls, setPolls] = useState<Poll[]>();
  const { data: totalPolls, refetch: refetchTotalPolls } =
    useScaffoldContractRead({
      contractName: "Privote",
      functionName: "nextPollId",
    });

  const {
    data: rawAllPolls,
    refetch: refetchAllPolls,
    isLoading: isLoadingAllPolls,
    error: errorAllPolls,
  } = useScaffoldContractRead({
    contractName: "Privote",
    functionName: "fetchPolls",
    args: [BigInt(currentPage), BigInt(limit), reversed],
  });

  const {
    data: rawUserPolls,
    refetch: refetchUserPolls,
    isLoading: isLoadingUserPolls,
    error: errorUserPolls,
  } = useScaffoldContractRead({
    contractName: "Privote",
    functionName: "fetchUserPolls",
    args: [address, BigInt(currentPage), BigInt(limit), reversed],
  });

  const rawPolls = address ? rawUserPolls : rawAllPolls;
  const refetchPolls = address ? refetchUserPolls : refetchAllPolls;
  const isLoading = address ? isLoadingUserPolls : isLoadingAllPolls;
  const error = address ? errorUserPolls : errorAllPolls;

  const [lastTimer, setLastTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (lastTimer) {
      clearInterval(lastTimer);
    }

    if (!rawPolls) {
      setPolls([]);
      return;
    }

    const interval = setInterval(() => {
      const _polls: Poll[] = [];

      for (const rawPoll of rawPolls) {
        _polls.push({
          ...rawPoll,
          status: getPollStatus(rawPoll),
        });
      }

      setPolls(_polls);
    }, 1000);

    setLastTimer(interval);

    () => {
      clearInterval(interval);
    };
  }, [rawPolls]);

  function refetch() {
    refetchTotalPolls();
    refetchPolls();
  }

  return {
    totalPolls: Number(totalPolls || 0n),
    polls,
    refetch,
    isLoading,
    error,
  };
};
