import { PollPolicyType } from '@/types';

export type IPollCreationFunction =
  | 'createPollWithFreeForAll'
  | 'createPollWithAnonAadhaar'
  | 'createPollWithERC20'
  // | 'createPollWithERC20Votes'
  | 'createPollWithToken'
  | 'createPollWithGitcoin'
  | 'createPollWithMerkle'
  | 'createPollWithSemaphore'
  | 'createPollWithZupass';
// | 'createPollWithHats';

export const getWrapperFunctionName = (policy: PollPolicyType) => {
  if (policy === PollPolicyType.GitcoinPassport) {
    return 'createPollWithGitcoin';
  }

  return `createPollWith${policy}` as IPollCreationFunction;
};
