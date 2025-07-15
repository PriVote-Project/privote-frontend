import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_PRIVOTE_SUBGRAPH_URL;

if (!endpoint) {
  throw new Error('NEXT_PUBLIC_PRIVOTE_SUBGRAPH_URL is not defined in your .env file');
}

export const client = new GraphQLClient(endpoint);
