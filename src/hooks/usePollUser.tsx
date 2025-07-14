import type { PollUser } from '@/types'
import type { Keypair } from '@maci-protocol/domainobjs'
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/graphql'
import { GET_POLL_USER_QUERY } from '@/services/queries/pollUser'

interface UsePollUserParams {
  maciKeypair: Keypair | null
  pollAddress: string
}

export const usePollUser = ({ maciKeypair, pollAddress }: UsePollUserParams) => {
  const id = maciKeypair
    ? `${maciKeypair.publicKey.asContractParam().x} ${
        maciKeypair.publicKey.asContractParam().y
      } ${pollAddress}`
    : null

  return useQuery<PollUser>({
    queryKey: ['pollUser', id],
    queryFn: async () => {
      if (!id) throw new Error('Keypair not found')

      const data: { pollUser: PollUser } = await client.request(GET_POLL_USER_QUERY, {
        id
      })

      if (!data.pollUser) {
        throw new Error('Poll user not found')
      }

      return data.pollUser
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
