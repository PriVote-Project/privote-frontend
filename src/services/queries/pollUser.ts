import { gql } from 'graphql-request';

export const GET_POLL_USER_QUERY = gql`
  query GetPollUser($id: Bytes!) {
    pollUser(id: $id) {
      id
      createdAt
      accounts {
        id
        nullifier
        voiceCreditBalance
        createdAt
      }
    }
  }
`;
