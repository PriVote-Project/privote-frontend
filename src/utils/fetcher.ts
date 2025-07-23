import { request } from 'graphql-request';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const fetcher = <T>([url, query, variables]: [string, string, Record<string, any> | undefined]): Promise<T> =>
  request(url, query, variables);
