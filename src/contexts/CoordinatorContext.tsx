import useAppConstants from '@/hooks/useAppConstants';
import usePollContext from '@/hooks/usePollContext';
import usePrivoteContract from '@/hooks/usePrivoteContract';
import { EMode } from '@/types';
import { PUBLIC_COORDINATOR_SERVICE_URL } from '@/utils/constants';
import EModeMapping from '@/utils/mode';
import { handleNotice, notification } from '@/utils/notification';
import { type ITallyData } from '@maci-protocol/sdk/browser';
import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import useEthersSigner from '../hooks/useEthersSigner';
import {
  type ICoordinatorContextType,
  type IFinalizePollArgs,
  type IGenerateData,
  type TCoordinatorServiceResult
} from './types';

export const CoordinatorContext = createContext<ICoordinatorContextType | undefined>(undefined);

async function makeCoordinatorServicePostRequest<T>(url: string, body: string): Promise<TCoordinatorServiceResult<T>> {
  const type = url.split('/').pop() ?? 'finalize';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message
        ? `${response.status} - ${response.statusText}. ${errorData.message}`
        : `${response.status} - ${response.statusText}`;
      return { success: false, error: new Error(`Failed to ${type} proofs: ${errorMessage}`) };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: new Error(`Failed to ${type}: ${error}`)
    };
  }
}

export const CoordinatorProvider = ({ children }: { children: ReactNode }) => {
  const [privKey, setPrivKey] = useState<string>('');
  const { poll, checkMergeStatus, checkIsTallied } = usePollContext();
  const signer = useEthersSigner();
  const privoteContract = usePrivoteContract();
  const { slugs } = useAppConstants();
  const privoteContractAddress = privoteContract?.address;
  const chain = slugs.coordinator;
  const pollId = poll?.pollId;
  const pollEMode = poll?.mode || EMode.NON_QV;

  const merge = useCallback(
    async (pollId: number): Promise<TCoordinatorServiceResult<boolean>> => {
      return await makeCoordinatorServicePostRequest<boolean>(
        `${PUBLIC_COORDINATOR_SERVICE_URL}/v1/proof/merge`,
        JSON.stringify({
          maciContractAddress: privoteContractAddress,
          pollId,
          chain
        })
      );
    },
    [privoteContractAddress, chain]
  );

  const generateProofs = useCallback(
    async (pollId: number): Promise<TCoordinatorServiceResult<IGenerateData>> => {
      return await makeCoordinatorServicePostRequest<IGenerateData>(
        `${PUBLIC_COORDINATOR_SERVICE_URL}/v1/proof/generate`,
        JSON.stringify({
          poll: pollId,
          maciContractAddress: privoteContractAddress,
          mode: EModeMapping[pollEMode],
          blocksPerBatch: 1000000,
          chain,
          useWasm: true,
          coordinatorPrivateKey: privKey
        })
      );
    },
    [privKey, privoteContractAddress, pollEMode, chain]
  );

  const submit = useCallback(
    async (pollId: number): Promise<TCoordinatorServiceResult<ITallyData>> => {
      return await makeCoordinatorServicePostRequest<ITallyData>(
        `${PUBLIC_COORDINATOR_SERVICE_URL}/v1/proof/submit`,
        JSON.stringify({
          pollId,
          maciContractAddress: privoteContractAddress,
          chain
        })
      );
    },
    [privoteContractAddress, chain]
  );

  const finalizePoll = useCallback(
    async ({ setFinalizeStatus }: IFinalizePollArgs) => {
      if (!signer) {
        console.log('No signer');
        return;
      }

      if (!pollId) {
        console.log('No pollId');
        return;
      }

      const isTallied = await checkIsTallied();

      if (isTallied) {
        setFinalizeStatus('notStarted');
        return;
      }

      let notificationId = '';
      const hasMerged = await checkMergeStatus().catch(() => setFinalizeStatus('notStarted'));
      if (!hasMerged) {
        setFinalizeStatus('merging');
        notificationId = notification.loading('Merging poll...');
        const mergeResult = await merge(Number(pollId));
        if (!mergeResult.success) {
          setFinalizeStatus('notStarted');
          handleNotice({ message: 'Failed to merge. Please try again.', type: 'error', id: notificationId });
          return;
        }

        handleNotice({ message: 'The poll has been merged.', type: 'success', id: notificationId });
      }

      setFinalizeStatus('proving');
      notificationId = handleNotice({ message: 'Generating proofs...', type: 'loading', id: notificationId });
      const proveResult = await generateProofs(Number(pollId));
      if (!proveResult.success) {
        setFinalizeStatus('notStarted');
        handleNotice({ message: 'Failed to generate proofs. Please try again.', type: 'error', id: notificationId });
        return;
      }
      handleNotice({ message: 'The proofs have been generated.', type: 'success', id: notificationId });

      setFinalizeStatus('submitting');
      notificationId = notification.loading('Submitting proofs on-chain...');
      const submitResult = await submit(Number(pollId));
      if (!submitResult.success) {
        setFinalizeStatus('notStarted');
        handleNotice({ message: 'Failed to submit proofs. Please try again.', type: 'error', id: notificationId });
        return;
      }
      handleNotice({ message: 'The votes have been submitted.', type: 'success', id: notificationId });

      setFinalizeStatus('submitted');
      return;
    },
    [checkIsTallied, checkMergeStatus, generateProofs, merge, signer, submit, pollId]
  );

  const value = useMemo<ICoordinatorContextType>(
    () => ({
      privKey,
      setPrivKey,
      finalizePoll
    }),
    [finalizePoll, privKey, setPrivKey]
  );

  return <CoordinatorContext.Provider value={value as ICoordinatorContextType}>{children}</CoordinatorContext.Provider>;
};
