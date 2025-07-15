import { TransformedPoll } from '@/types';
import { type Keypair } from '@maci-protocol/domainobjs';
import { type IProof, type ITallyData } from '@maci-protocol/sdk/browser';
import { type QueryObserverResult, type RefetchOptions } from '@tanstack/react-query';

export interface IVoteArgs {
  voteOptionIndex: bigint;
  newVoteWeight: bigint;
}

export interface IGenerateData {
  processProofs: IProof[];
  tallyProofs: IProof[];
  tallyData: ITallyData;
}
export type TCoordinatorServiceResult<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export type FinalizeStatus = 'notStarted' | 'merging' | 'proving' | 'submitting' | 'submitted';

export interface ICoordinatorContextType {
  finalizeStatus: FinalizeStatus;
  checkIsTallied: (pollId: number) => Promise<boolean>;
  finalizeProposal: (pollId: number) => Promise<void>;
}

export interface IPollContextType {
  isLoading: boolean;
  error?: string;
  poll?: TransformedPoll | null;
  pollLoading: boolean;
  isPollError: boolean;
  pollError: Error | null;
  hasJoinedPoll: boolean;
  initialVoiceCredits: number;
  pollStateIndex?: string;
  isRegistered?: boolean;
  maciKeypair?: Keypair;
  stateIndex?: string;
  onJoinPoll: (signupData?: string) => Promise<void>;
  refetchPoll: (options?: RefetchOptions) => Promise<QueryObserverResult<TransformedPoll | null, Error>>;
}

export const VoteOption = {
  Yes: 0,
  No: 1,
  Abstain: 2
};

export type VoteOptionType = keyof typeof VoteOption;
