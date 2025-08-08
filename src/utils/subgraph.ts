import { GET_POLL_USER_QUERY } from '@/services/queries/pollUser';
import { GET_PRIVOTE_USER_QUERY } from '@/services/queries/privoteUser';
import { GET_USER_QUERY } from '@/services/queries/user';
import type { PollUser, User } from '@/types';
import { padKey, PublicKey, type Keypair } from '@maci-protocol/domainobjs';
import { fetcher } from './fetcher';

export interface ISignedupUserData {
  isRegistered: boolean;
  stateIndex: string | undefined;
}

export interface IJoinedUserData {
  isJoined: boolean;
  voiceCredits: string | undefined;
  pollStateIndex: string | undefined;
}

export const getSignedupUserData = async (url: string, keyPair: Keypair) => {
  try {
    console.log('keyPair publicKey', keyPair.publicKey.serialize())
    const data: { user: User } = await fetcher([
      url,
      GET_PRIVOTE_USER_QUERY,
      {
        id: `${keyPair?.publicKey.asContractParam().x} ${keyPair?.publicKey.asContractParam().y}`
      }
    ]);

    if (!data.user) {
      throw new Error(`User with this public key not found: ${keyPair.publicKey.serialize()}`);
    }

    if (data.user.accounts.length > 0) {
      return {
        isRegistered: true,
        stateIndex: data.user.accounts[0].id
      };
    }

    throw new Error('User not registered');
  } catch (err) {
    console.error(err);

    return { isRegistered: false, stateIndex: undefined };
  }
};

export const getJoinedUserData = async (url: string, pollAddress: string, keyPair?: Keypair) => {
  try {
    const data: { pollUser: PollUser } = await fetcher([
      url,
      GET_POLL_USER_QUERY,
      {
        id: `${keyPair?.publicKey.asContractParam().x} ${keyPair?.publicKey.asContractParam().y} ${pollAddress}`
      }
    ]);

    if (!data.pollUser) {
      throw new Error('Poll user not found');
    }

    if (data.pollUser.accounts.length > 0) {
      return {
        isJoined: true,
        voiceCredits: data.pollUser.accounts[0].voiceCreditBalance,
        pollStateIndex: data.pollUser.accounts[0].id.split('-')?.[1] || ''
      };
    }

    throw new Error(`User not joined poll: ${pollAddress}`);
  } catch (err) {
    console.error(err);

    return {
      isJoined: false,
      voiceCredits: undefined,
      pollStateIndex: undefined
    };
  }
};

export const getKeys = async (url: string) => {
  const data: { users: { id: string }[] } = await fetcher([url, GET_USER_QUERY, {}]);

  if (!data.users) {
    throw new Error('No users data in response');
  }

  const userKeys = data.users.map(user => {
    // Split the id into x and y coordinates and convert to BigInt
    const [x, y] = user.id.split(' ');
    return new PublicKey([BigInt(x), BigInt(y)]);
  });

  return [padKey, ...userKeys];
};
