import { gql } from 'graphql-request';

export const GET_POLLS_QUERY = gql`
  query GetPolls(
    $first: Int!
    $skip: Int!
    $where: Poll_filter
    $orderBy: Poll_orderBy
    $orderDirection: OrderDirection
  ) {
    polls(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      pollId
      name
      startDate
      endDate
      voteOptions
      owner
      policyTrait
    }
  }
`;

export const GET_POLL_QUERY = gql`
  query GetPoll($id: Bytes!) {
    poll(id: $id) {
      id
      pollId
      name
      coordinatorPublicKey
      description
      pollType
      startDate
      endDate
      duration
      voteOptions
      mode
      policyTrait
      policyData
      totalSignups
      numMessages
      owner
      createdAt
      options {
        id
        name
        description
        link
        cid
      }
      users {
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
  }
`;
