import { client } from '@/lib/graphql'
import { GET_POLL_USER_QUERY } from '@/services/queries/pollUser'
import { GET_PRIVOTE_USER_QUERY } from '@/services/queries/privoteUser'
import { type Keypair } from '@maci-protocol/domainobjs'
import type { User, PollUser } from '@/types'

export interface ISignedupUserData {
  isRegistered: boolean
  stateIndex: string | undefined
}

export interface IJoinedUserData {
  isJoined: boolean
  voiceCredits: string | undefined
  pollStateIndex: string | undefined
}

export const getSignedupUserData = async (keyPair?: Keypair | null) => {
  try {
    const data: { user: User } = await client.request(GET_PRIVOTE_USER_QUERY, {
      id: `${keyPair?.publicKey.asContractParam().x} ${keyPair?.publicKey.asContractParam().y}`
    })

    if (!data.user) {
      throw new Error('User not found')
    }

    if (data.user.accounts.length > 0) {
      return {
        isRegistered: true,
        stateIndex: data.user.accounts[0].id
      }
    }

    throw new Error('User not registered')
  } catch (err) {
    console.error(err)

    return { isRegistered: false, stateIndex: undefined }
  }
}

export const getJoinedUserData = async (pollAddress: string, keyPair?: Keypair) => {
  try {
    const data: { pollUser: PollUser } = await client.request(GET_POLL_USER_QUERY, {
      id: `${keyPair?.publicKey.asContractParam().x} ${keyPair?.publicKey.asContractParam().y} ${pollAddress}`
    })

    if (!data.pollUser) {
      throw new Error('Poll user not found')
    }

    if (data.pollUser.accounts.length > 0) {
      return {
        isJoined: true,
        voiceCredits: data.pollUser.accounts[0].voiceCreditBalance,
        pollStateIndex: data.pollUser.accounts[0].id.split('-')?.[1] || ''
      }
    }

    throw new Error(`User not joined poll: ${pollAddress}`)
  } catch (err) {
    console.error(err)

    return { isJoined: false, voiceCredits: undefined, pollStateIndex: undefined }
  }
}
