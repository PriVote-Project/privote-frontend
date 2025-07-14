import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { PublicKey } from '@maci-protocol/domainobjs'
// import { useAnonAadhaar } from '@anon-aadhaar/react'
import styles from '@/styles/userPoll.module.css'
import PollAbi from '@/abi/Poll'
import { PollType } from '@/types'
import { usePoll } from '@/hooks/usePollContext'
import { useVoting } from '@/hooks/useVoting'
import usePollResults from '@/hooks/usePollResults'
import PollHeader from '../PollHeader'
import VotingSection from '../VotingSection'
import { Button, ErrorState } from '@/components/shared'
import { useSigContext } from '@/contexts/SigContext'

interface IPollDetails {
  pollAddress: string
}

const PollDetails = ({ pollAddress }: IPollDetails) => {
  const { address, isConnected } = useAccount()
  // const [AnonAadhaar] = useAnonAadhaar()
  const {
    hasJoinedPoll,
    pollStateIndex,
    poll,
    isPollError,
    pollError,
    onJoinPoll,
    isLoading: isRegistering,
    refetchPoll
  } = usePoll()
  const { maciKeypair, isRegistered, onSignup } = useSigContext()
  // const { registerUser, isLoading: isRegistering } = useUserRegister()
  const [coordinatorPubKey, setCoordinatorPubKey] = useState<PublicKey>()
  const { result, totalVotes } = usePollResults(poll)

  const { data: coordinatorPubKeyResult } = useReadContract({
    abi: PollAbi,
    address: pollAddress as `0x${string}`,
    functionName: 'coordinatorPublicKey'
  })

  const {
    votes,
    isVotesInvalid,
    selectedCandidate,
    setIsVotesInvalid,
    setSelectedCandidate,
    voteUpdated,
    castVote,
    isPending
  } = useVoting({
    coordinatorPubKey,
    pollAddress: poll?.id,
    mode: poll?.mode,
    pollType: poll?.pollType || PollType.NOT_SELECTED,
    status: poll?.status,
    keypair: maciKeypair,
    pollId: BigInt(poll?.pollId || 0),
    stateIndex: Number(pollStateIndex),
    maxVotePerPerson: Number(poll?.maxVotePerPerson || 0)
  })

  useEffect(() => {
    if (!coordinatorPubKeyResult) return
    try {
      const publicKey = new PublicKey([
        BigInt((coordinatorPubKeyResult as bigint[])[0].toString()),
        BigInt((coordinatorPubKeyResult as bigint[])[1].toString())
      ])
      setCoordinatorPubKey(publicKey)
    } catch (err) {
      console.error('Error setting coordinator public key:', err)
    }
  }, [coordinatorPubKeyResult])

  if (isPollError) {
    return <ErrorState title="Error Loading Poll" error={pollError} retryAction={refetchPoll} />
  }

  if (!poll) return null
  return (
    <div className={styles['poll-details']}>
      <PollHeader
        pollName={poll.name}
        policyData={poll.policyData}
        pollPolicyType={poll.policyTrait}
        pollType={poll.pollType}
        pollDescription={poll.description}
        pollEndTime={BigInt(poll.endDate)}
        pollStartTime={BigInt(poll.startDate)}
        status={poll.status}
        isConnected={isConnected}
      />

      <VotingSection
        votes={votes}
        isQv={poll.mode}
        pollTitle={poll.name}
        pollDescription={poll.description}
        pollId={BigInt(poll.pollId)}
        pollStatus={poll.status}
        pollType={poll.pollType}
        maxVotePerPerson={Number(poll.maxVotePerPerson)}
        authType={poll.policyTrait}
        options={poll.options}
        pollDeployer={poll.owner}
        userAddress={address}
        isConnected={isConnected}
        isUserJoined={hasJoinedPoll}
        result={result}
        totalVotes={totalVotes}
        isVotesInvalid={isVotesInvalid}
        selectedCandidate={selectedCandidate}
        isPending={isPending}
        onVoteUpdate={voteUpdated}
        setIsVotesInvalid={setIsVotesInvalid}
        setSelectedCandidate={setSelectedCandidate}
        onVote={castVote}
      />
    </div>
  )
}

export default PollDetails
