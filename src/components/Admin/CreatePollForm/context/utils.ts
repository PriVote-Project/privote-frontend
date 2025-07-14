// Poll Deployment Helpers
import type { IPollData } from '../types'
import { PublicKey } from '@maci-protocol/domainobjs'
import { PollPolicyType, PollType, EMode } from '@/types'
import { ZERO_ADDRESS, ZERO_BYTES32 } from '@/utils/constants'

/**
 * Maps PollType string values to their corresponding numeric indices for contract use
 */
const pollTypeToIndex = {
  [PollType.NOT_SELECTED]: 0,
  [PollType.SINGLE_VOTE]: 1,
  [PollType.MULTIPLE_VOTE]: 2,
  [PollType.WEIGHTED_MULTIPLE_VOTE]: 3
}

/**
 * Maps EMode string values to their corresponding numeric indices for contract use
 */
const eModeToIndex = {
  [EMode.QV]: 0,
  [EMode.NON_QV]: 1,
  [EMode.FULL]: 2
}

/**
 * Converts a PollType string value to its numeric index
 * @param pollType - The PollType string value
 * @returns The corresponding numeric index for the contract
 */
function getPollTypeIndex(pollType: PollType): number {
  return pollTypeToIndex[pollType] ?? 0
}

/**
 * Converts an EMode string value to its numeric index
 * @param mode - The EMode string value
 * @returns The corresponding numeric index for the contract
 */
function getEModeIndex(mode: EMode | null): number {
  return mode ? eModeToIndex[mode] ?? 0 : 0
}

/**
 * Interface for the arguments needed by the getPollArgs function
 */
interface GetPollArgsParams {
  pollData: IPollData
  encodedOptions: string[]
  startTime: bigint
  endTime: bigint
  voiceCredits?: bigint
}

/**
 * Generates the arguments needed for poll creation based on policy type and configuration
 * This utility function handles all policy types and their specific configuration needs
 *
 * @param params - The parameters needed to generate poll arguments
 * @returns An array of arguments ready to be passed to the contract function
 */
export function getPollArgs({
  pollData,
  encodedOptions,
  startTime,
  endTime,
  voiceCredits = 100n
}: GetPollArgsParams): readonly any[] {
  // Create poll metadata
  const metadata = JSON.stringify({
    pollType: getPollTypeIndex(pollData.pollType),
    maxVotePerPerson: pollData.maxVotePerPerson,
    description: pollData.description
  })

  console.log(metadata)

  // Common base arguments used by all policy types
  const baseArgs = [
    pollData.title as string,
    pollData.options.map((option) => option.title ?? ''),
    encodedOptions,
    metadata,
    startTime,
    endTime,
    getEModeIndex(pollData.mode), // Convert EMode string to numeric index
    PublicKey.deserialize(pollData.publicKey).asContractParam(),
    [ZERO_ADDRESS] // relayers - currently just one zero address
  ]

  // Get policy-specific configuration
  const config = pollData.policyConfig || {}

  // Handle arguments based on policy type
  switch (pollData.policyType) {
    case PollPolicyType.FreeForAll:
      return [...baseArgs, voiceCredits]

    case PollPolicyType.AnonAadhaar:
      const verifierAddress = config.verifierAddress || ZERO_ADDRESS
      const nullifierSeed = config.nullifierSeed || '1'

      return [...baseArgs, verifierAddress, nullifierSeed, voiceCredits]

    case PollPolicyType.ERC20: {
      const tokenAddress = config.tokenAddress || ZERO_ADDRESS
      const threshold = config.threshold ? BigInt(config.threshold) : 1n

      return [...baseArgs, tokenAddress, threshold, voiceCredits]
    }

    case PollPolicyType.Token: {
      const tokenAddress = config.tokenAddress || ZERO_ADDRESS

      return [...baseArgs, tokenAddress, voiceCredits]
    }

    // case PollPolicyType.EAS: {
    //   const easContract = config.easContract || ZERO_ADDRESS
    //   const attester = config.attester || ZERO_ADDRESS
    //   const schema = config.schema || ZERO_BYTES32

    //   return [...baseArgs, easContract, attester, schema, voiceCredits]
    // }

    // case PollPolicyType.Gitcoin:
    //   const decoderAddress = config.decoderAddress || ZERO_ADDRESS
    //   const passingScore = config.passingScore ? BigInt(config.passingScore) : 0n
    //   return [...baseArgs, decoderAddress, passingScore, voiceCredits]

    // case PollPolicyType.Merkle: {
    //   const merkleRoot = config.merkleRoot || ZERO_BYTES32

    //   return [...baseArgs, merkleRoot, voiceCredits]
    // }

    // case PollPolicyType.Semaphore: {
    //   const semaphoreContract = config.semaphoreContract || ZERO_ADDRESS
    //   const groupId = config.groupId ? BigInt(config.groupId) : 0n

    //   return [...baseArgs, semaphoreContract, groupId, voiceCredits]
    // }

    // case PollPolicyType.Zupass: {
    //   const eventId = config.eventId || ''
    //   const signer1 = config.signer1 || ''
    //   const signer2 = config.signer2 || ''
    //   const zupassVerifier = config.zupassVerifier || ''

    //   return [...baseArgs, eventId, signer1, signer2, zupassVerifier, voiceCredits]
    // }

    default:
      return [...baseArgs, voiceCredits]
  }
}
