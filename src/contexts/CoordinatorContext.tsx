import useAppConstants from '@/hooks/useAppConstants';
import usePollContext from '@/hooks/usePollContext';
import usePrivoteContract from '@/hooks/usePrivoteContract';
import { EMode } from '@/types';
import { PUBLIC_COORDINATOR_SERVICE_URL } from '@/utils/constants';
import { makeCoordinatorServiceGetRequest, makeCoordinatorServicePostRequest } from '@/utils/coordinator';
import EModeMapping from '@/utils/mode';
import { handleNotice } from '@/utils/notification';
import { IProof, type ITallyData } from '@maci-protocol/sdk/browser';
import { publicEncrypt } from 'crypto';
import { createContext, useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { hashMessage } from 'viem';
import { useSignMessage } from 'wagmi';
import useEthersSigner from '../hooks/useEthersSigner';
import {
  proofWebSocketService,
  type IGenerateProofDto,
  type IProofGenerationCallbacks
} from '@/services/proofWebSocketService';
import {
  type ICoordinatorContextType,
  type IFinalizePollArgs,
  type IGenerateData,
  type TCoordinatorServiceResult
} from './types';

export const CoordinatorContext = createContext<ICoordinatorContextType | undefined>(undefined);

export const CoordinatorProvider = ({ children }: { children: ReactNode }) => {
  const { poll, checkMergeStatus, checkIsTallied } = usePollContext();
  const signer = useEthersSigner();
  const privoteContract = usePrivoteContract();
  const { slugs } = useAppConstants();
  const privoteContractAddress = privoteContract?.address;
  const chain = slugs.coordinator;
  const pollId = poll?.pollId;
  const pollEMode = poll?.mode || EMode.NON_QV;

  const { signMessageAsync } = useSignMessage();

  const getPublicKey = useCallback(async () => {
    return await makeCoordinatorServiceGetRequest<{ publicKey: string }>(
      `${PUBLIC_COORDINATOR_SERVICE_URL}/v1/proof/publicKey`
    );
  }, []);

  const getAuthorizationHeader = useCallback(async () => {
    if (!pollId) {
      throw new Error('Failed to get poll id.');
    }

    const result = await getPublicKey();
    if (!result.success) {
      throw new Error('Failed to get public key');
    }
    const message = `Sign this message to prove your identity`;
    const signature = await signMessageAsync({ message });
    const digest = hashMessage(message).slice(2);
    const encrypted = publicEncrypt(result.data.publicKey, Buffer.from(`${signature}:${digest}`));

    return `Bearer ${pollId} ${chain} ${encrypted.toString('base64')}`;
  }, [getPublicKey, signMessageAsync, pollId, chain]);

  const merge = useCallback(
    async (pollId: number, headers?: Record<string, string>): Promise<TCoordinatorServiceResult<boolean>> => {
      return await makeCoordinatorServicePostRequest<boolean>(
        `${PUBLIC_COORDINATOR_SERVICE_URL}/v1/proof/merge`,
        JSON.stringify({
          maciContractAddress: privoteContractAddress,
          pollId,
          chain
        }),
        headers
      );
    },
    [privoteContractAddress, chain]
  );

  const generateProofs = useCallback(
    async (
      pollId: number,
      headers?: Record<string, string>,
      onProgress?: (progress: { proofs: IProof[]; current: number; total: number }) => void
    ): Promise<TCoordinatorServiceResult<IGenerateData>> => {
      try {
        // Extract auth token from headers
        const authToken = headers?.Authorization;
        if (!authToken) {
          return {
            success: false,
            error: new Error('Authorization header is required for WebSocket connection')
          };
        }

        // Connect to WebSocket if not already connected
        if (!proofWebSocketService.connected) {
          await proofWebSocketService.connect(authToken);
        }

        // Prepare proof generation data
        const proofData: IGenerateProofDto = {
          poll: pollId,
          maciContractAddress: privoteContractAddress!,
          mode: EModeMapping[pollEMode],
          blocksPerBatch: 1000000,
          chain,
          useWasm: true
        };

        // Set up callbacks
        const callbacks: IProofGenerationCallbacks = {
          onProgress: progressData => {
            onProgress?.({
              proofs: progressData.proofs,
              current: progressData.current,
              total: progressData.total
            });
          }
        };

        // Generate proofs via WebSocket
        const result = await proofWebSocketService.generateProofs(proofData, callbacks);

        return {
          success: true,
          data: {
            processProofs: result.processProofs,
            tallyData: result.tallyData
          }
        };
      } catch (error) {
        console.error('Proof generation failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error : new Error('Unknown error occurred during proof generation')
        };
      }
    },
    [privoteContractAddress, pollEMode, chain]
  );

  const submit = useCallback(
    async (pollId: number, headers?: Record<string, string>): Promise<TCoordinatorServiceResult<ITallyData>> => {
      return await makeCoordinatorServicePostRequest<ITallyData>(
        `${PUBLIC_COORDINATOR_SERVICE_URL}/v1/proof/submit`,
        JSON.stringify({
          pollId,
          maciContractAddress: privoteContractAddress,
          chain
        }),
        headers
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

      let notificationId = handleNotice({
        message: 'Checking if poll is tallied...',
        type: 'loading'
      });
      try {
        const isTallied = await checkIsTallied();

        if (isTallied) {
          handleNotice({
            message: 'Poll is already tallied.',
            type: 'info',
            id: notificationId
          });
          setFinalizeStatus('notStarted');
          return;
        }

        notificationId = handleNotice({
          message: 'Awaiting user approval...',
          type: 'loading',
          id: notificationId
        });
        setFinalizeStatus('signing');

        const authHeaderValue = await getAuthorizationHeader();
        const headers = {
          Authorization: authHeaderValue
        };

        notificationId = handleNotice({
          message: 'Checking poll merge status...',
          type: 'loading',
          id: notificationId
        });
        const hasMerged = await checkMergeStatus().catch(() => setFinalizeStatus('notStarted'));
        if (!hasMerged) {
          setFinalizeStatus('merging');
          notificationId = handleNotice({
            message: 'Merging poll...',
            type: 'loading',
            id: notificationId
          });
          const mergeResult = await merge(Number(pollId), headers);
          if (!mergeResult.success) {
            setFinalizeStatus('notStarted');
            handleNotice({ message: 'Failed to merge. Please try again.', type: 'error', id: notificationId });
            return;
          }

          handleNotice({ message: 'The poll has been merged.', type: 'success', id: notificationId });
        }

        setFinalizeStatus('proving');
        notificationId = handleNotice({ message: 'Generating proofs...', type: 'loading', id: notificationId });

        const proveResult = await generateProofs(Number(pollId), headers, progress => {
          const progressMessage = `Generating proofs... (${progress.current}/${progress.total})`;
          handleNotice({
            message: progressMessage,
            type: 'loading',
            id: notificationId
          });
        });

        if (!proveResult.success) {
          setFinalizeStatus('notStarted');
          handleNotice({ message: 'Failed to generate proofs. Please try again.', type: 'error', id: notificationId });
          return;
        }
        handleNotice({ message: 'The proofs have been generated.', type: 'success', id: notificationId });

        setFinalizeStatus('submitting');
        notificationId = handleNotice({
          message: 'Submitting proofs on-chain...',
          type: 'loading',
          id: notificationId
        });
        const submitResult = await submit(Number(pollId), headers);
        if (!submitResult.success) {
          setFinalizeStatus('notStarted');
          handleNotice({ message: 'Failed to submit proofs. Please try again.', type: 'error', id: notificationId });
          return;
        }
        handleNotice({ message: 'The votes have been submitted.', type: 'success', id: notificationId });

        setFinalizeStatus('submitted');
        return;
      } catch (error) {
        console.error(error);
        setFinalizeStatus('notStarted');
        handleNotice({ message: 'An error occurred. Please try again.', type: 'error', id: notificationId });
      }
    },
    [checkIsTallied, checkMergeStatus, generateProofs, merge, signer, submit, pollId, getAuthorizationHeader]
  );

  // Cleanup WebSocket connection on unmount
  useEffect(() => {
    return () => {
      if (proofWebSocketService.connected) {
        console.log('🧹 Cleaning up WebSocket connection...');
        proofWebSocketService.disconnect();
      }
    };
  }, []);

  const value = useMemo<ICoordinatorContextType>(
    () => ({
      finalizePoll
    }),
    [finalizePoll]
  );

  return <CoordinatorContext.Provider value={value as ICoordinatorContextType}>{children}</CoordinatorContext.Provider>;
};
