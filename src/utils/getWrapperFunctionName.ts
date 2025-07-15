import { PollPolicyType } from '@/types';

export type IPollCreationFunction =
  | 'createPollWithFreeForAll'
  | 'createPollWithAnonAadhaar'
  | 'createPollWithERC20'
  | 'createPollWithToken';

export const getWrapperFunctionName = (policy: PollPolicyType) => {
  return `createPollWith${policy}` as IPollCreationFunction;
};
