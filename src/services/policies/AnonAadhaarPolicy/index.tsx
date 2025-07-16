import useDecodeService from '@/hooks/useDecodeService';
import { AnonAadhaarPolicyData } from '@/services/decode/types';
import { PollPolicyType } from '@/types';
import { ArtifactsOrigin, artifactUrls, init, InitArgs } from '@anon-aadhaar/core';
import { LogInWithAnonAadhaar, useAnonAadhaar } from '@anon-aadhaar/react';
import { useCallback, useEffect, useState } from 'react';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import styles from '../styles.module.css';
import { PolicyHookProps, PolicyHookResult } from '../types';

const anonAadhaarInitArgs: InitArgs = {
  wasmURL: artifactUrls.v2.wasm,
  zkeyURL: artifactUrls.v2.zkey,
  vkeyURL: artifactUrls.v2.vk,
  artifactsOrigin: ArtifactsOrigin.server
};

/**
 * Hook for handling AnonAadhaar policy
 * @param props Policy hook props
 * @returns Policy hook result with methods and components
 */
export const useAnonAadhaarPolicy = (props: PolicyHookProps): PolicyHookResult => {
  const { isConnected, isRegistered, policyData, address } = props;
  const [anonAadhaar] = useAnonAadhaar();
  const [isLoading, setIsLoading] = useState(false);

  // Extract nullifierSeed from policyData or use default
  const decodedPolicyData = useDecodeService<AnonAadhaarPolicyData>(PollPolicyType.AnonAadhaar, policyData);
  const nullifierSeed = decodedPolicyData?.nullifierSeed ? decodedPolicyData.nullifierSeed : 4534n;

  useEffect(() => {
    init(anonAadhaarInitArgs);
  }, []);

  /**
   * AnonAadhaar Login Component
   */
  const AnonAadhaarComponent: React.FC = useCallback(() => {
    if (!isConnected) {
      return <div className={styles.errorMessage}>Please connect your wallet to use AnonAadhaar verification</div>;
    }

    return (
      <>
        <div className={styles.policyHeader}>
          <div className={styles.policyIconWrapper}>
            <img src='/icons/aadhaar-icon.svg' alt='Aadhaar' className={styles.policyIcon} />
          </div>
          <div className={styles.policyTitle}>
            <h4>AnonAadhaar Verification</h4>
            <span className={styles.policySubtitle}>Identity Verification Required</span>
          </div>
        </div>

        <div className={styles.policyDetails}>
          <div className={styles.policyDetailRow}>
            <span className={styles.detailLabel}>Verification:</span>
            <span className={styles.detailValue}>
              Anonymous <span className={styles.highlight}>Aadhaar proof</span>
            </span>
          </div>
          <div className={styles.policyDetailRow}>
            <span className={styles.detailLabel}>Privacy:</span>
            <span className={styles.detailValue}>Zero-knowledge proof system</span>
          </div>
          <div className={styles.policyDetailRow}>
            <span className={styles.detailLabel}>Data Shared:</span>
            <span className={styles.detailValue}>No personal information revealed</span>
          </div>
        </div>

        {/* Verification Status */}
        <div
          className={`${styles.statusIndicator} ${anonAadhaar.status === 'logged-in' ? styles.success : styles.warning}`}
        >
          {anonAadhaar.status === 'logged-in' ? (
            <>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M13.5 4.5L6 12L2.5 8.5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              AnonAadhaar verification completed
            </>
          ) : (
            <>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <circle cx='8' cy='8' r='7' stroke='currentColor' strokeWidth='2' fill='none' />
                <path d='M8 5v3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                <circle cx='8' cy='11' r='1' fill='currentColor' />
              </svg>
              Verification required to join this poll
            </>
          )}
        </div>

        {/* Information about AnonAadhaar */}
        <div className={styles.anonAadhaarDescription}>
          <strong>About AnonAadhaar:</strong> This verification system allows you to prove your Indian identity
          anonymously without revealing any personal information. Your Aadhaar details remain completely private.
        </div>

        {/* AnonAadhaar Login Component */}
        <div className={styles.anonAadhaarWrapper}>
          <LogInWithAnonAadhaar nullifierSeed={nullifierSeed} signal={address} />
        </div>
      </>
    );
  }, [nullifierSeed, address, isConnected, anonAadhaar.status]);

  // User can join if connected, not registered and logged in with AnonAadhaar
  const canJoin = isConnected && !isRegistered && anonAadhaar.status === 'logged-in';

  /**
   * Get signup data for AnonAadhaar policy
   */
  const getSignupData = async (): Promise<string> => {
    setIsLoading(true);

    try {
      if (anonAadhaar.status !== 'logged-in') {
        throw new Error('AnonAadhaar verification required');
      }

      // Get the first proof from the array
      const proofKeys = Object.keys(anonAadhaar.anonAadhaarProofs);
      if (proofKeys.length === 0) {
        throw new Error('AnonAadhaar proof not found');
      }

      const firstProofKey = proofKeys[0];
      const pcd = anonAadhaar.anonAadhaarProofs[Number(firstProofKey)]?.pcd;

      if (!pcd) {
        throw new Error('AnonAadhaar proof not found');
      }

      const parsedPCD = JSON.parse(pcd);
      const { ageAbove18, gender, pincode, state, nullifier, groth16Proof, timestamp } = parsedPCD.proof;

      const revealArray: [bigint, bigint, bigint, bigint] = [
        BigInt(ageAbove18),
        BigInt(gender),
        BigInt(pincode),
        BigInt(state)
      ];

      const groth16Proof8: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint] = [
        BigInt(groth16Proof.pi_a[0]),
        BigInt(groth16Proof.pi_a[1]),
        BigInt(groth16Proof.pi_b[0][1]),
        BigInt(groth16Proof.pi_b[0][0]),
        BigInt(groth16Proof.pi_b[1][1]),
        BigInt(groth16Proof.pi_b[1][0]),
        BigInt(groth16Proof.pi_c[0]),
        BigInt(groth16Proof.pi_c[1])
      ];

      return encodeAbiParameters(
        parseAbiParameters(
          'uint256 nullifierSeed, uint256 nullifier, uint256 timestamp, uint256 signal, uint256[4] revealArray, uint256[8] groth16Proof'
        ),
        [BigInt(nullifierSeed), nullifier, timestamp, BigInt(address || '0'), revealArray, groth16Proof8]
      );
    } catch (error) {
      console.error('Error generating AnonAadhaar signup data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    canJoin,
    getSignupData,
    PolicyComponent: AnonAadhaarComponent,
    requirementsDescription: 'AnonAadhaar verification required to join this poll',
    isLoading
  };
};
