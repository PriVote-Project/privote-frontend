import type { GenericContractsDeclaration } from './types';

const deployedContracts = {
  10: {
    privote: {
      address: '0xB95614009a5DaeCf0a4CEEAc68a0EC10BdF27255',
      abi: [
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address',
              name: '_policy',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_initialVoiceCreditProxy',
              type: 'address'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            }
          ],
          name: 'createPoll',
          outputs: [
            {
              components: [
                {
                  internalType: 'address',
                  name: 'poll',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'messageProcessor',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'tally',
                  type: 'address'
                }
              ],
              internalType: 'struct IMACI.PollContracts',
              name: 'pollContracts',
              type: 'tuple'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_anonAadhaarVerifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_nullifierSeed',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithAnonAadhaar',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_easContract',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_attester',
              type: 'address'
            },
            {
              internalType: 'bytes32',
              name: '_schema',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithEAS',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_snapshotBlock',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20Votes',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithFreeForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_passportDecoder',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_thresholdScore',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithGitcoin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_hatsProtocol',
              type: 'address'
            },
            {
              internalType: 'uint256[]',
              name: '_criterionHats',
              type: 'uint256[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithHats',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'bytes32',
              name: '_merkleRoot',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithMerkle',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_semaphoreContract',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_groupId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithSemaphore',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithToken',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_eventId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer1',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer2',
              type: 'uint256'
            },
            {
              internalType: 'address',
              name: '_verifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithZupass',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ]
    }
  },
  11155420: {
    privote: {
      address: '0xf7C48eb2E936Cc0a52207C31DafA89E3ab603988',
      abi: [
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address',
              name: '_policy',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_initialVoiceCreditProxy',
              type: 'address'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            }
          ],
          name: 'createPoll',
          outputs: [
            {
              components: [
                {
                  internalType: 'address',
                  name: 'poll',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'messageProcessor',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'tally',
                  type: 'address'
                }
              ],
              internalType: 'struct IMACI.PollContracts',
              name: 'pollContracts',
              type: 'tuple'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_anonAadhaarVerifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_nullifierSeed',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithAnonAadhaar',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_easContract',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_attester',
              type: 'address'
            },
            {
              internalType: 'bytes32',
              name: '_schema',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithEAS',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_snapshotBlock',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20Votes',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithFreeForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_passportDecoder',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_thresholdScore',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithGitcoin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_hatsProtocol',
              type: 'address'
            },
            {
              internalType: 'uint256[]',
              name: '_criterionHats',
              type: 'uint256[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithHats',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'bytes32',
              name: '_merkleRoot',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithMerkle',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_semaphoreContract',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_groupId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithSemaphore',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithToken',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_eventId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer1',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer2',
              type: 'uint256'
            },
            {
              internalType: 'address',
              name: '_verifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithZupass',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ]
    }
  },
  534351: {
    privote: {
      address: '0x1a79b1998E7700Fc868f69a2a8230f06F1FDaB49',
      abi: [
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address',
              name: '_policy',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_initialVoiceCreditProxy',
              type: 'address'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            }
          ],
          name: 'createPoll',
          outputs: [
            {
              components: [
                {
                  internalType: 'address',
                  name: 'poll',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'messageProcessor',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'tally',
                  type: 'address'
                }
              ],
              internalType: 'struct IMACI.PollContracts',
              name: 'pollContracts',
              type: 'tuple'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_anonAadhaarVerifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_nullifierSeed',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithAnonAadhaar',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_easContract',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_attester',
              type: 'address'
            },
            {
              internalType: 'bytes32',
              name: '_schema',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithEAS',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_snapshotBlock',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20Votes',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithFreeForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_passportDecoder',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_thresholdScore',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithGitcoin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_hatsProtocol',
              type: 'address'
            },
            {
              internalType: 'uint256[]',
              name: '_criterionHats',
              type: 'uint256[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithHats',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'bytes32',
              name: '_merkleRoot',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithMerkle',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_semaphoreContract',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_groupId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithSemaphore',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithToken',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_eventId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer1',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer2',
              type: 'uint256'
            },
            {
              internalType: 'address',
              name: '_verifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithZupass',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ]
    }
  },
  84532: {
    privote: {
      address: '0x30d7DAd5D256C9df17C134e1524Ba8f0c3bB1268',
      abi: [
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address',
              name: '_policy',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_initialVoiceCreditProxy',
              type: 'address'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            }
          ],
          name: 'createPoll',
          outputs: [
            {
              components: [
                {
                  internalType: 'address',
                  name: 'poll',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'messageProcessor',
                  type: 'address'
                },
                {
                  internalType: 'address',
                  name: 'tally',
                  type: 'address'
                }
              ],
              internalType: 'struct IMACI.PollContracts',
              name: 'pollContracts',
              type: 'tuple'
            }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_anonAadhaarVerifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_nullifierSeed',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithAnonAadhaar',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_easContract',
              type: 'address'
            },
            {
              internalType: 'address',
              name: '_attester',
              type: 'address'
            },
            {
              internalType: 'bytes32',
              name: '_schema',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithEAS',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_threshold',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_snapshotBlock',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithERC20Votes',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithFreeForAll',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_passportDecoder',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_thresholdScore',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithGitcoin',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_hatsProtocol',
              type: 'address'
            },
            {
              internalType: 'uint256[]',
              name: '_criterionHats',
              type: 'uint256[]'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithHats',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'bytes32',
              name: '_merkleRoot',
              type: 'bytes32'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithMerkle',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_semaphoreContract',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_groupId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithSemaphore',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithToken',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            {
              internalType: 'string',
              name: '_name',
              type: 'string'
            },
            {
              internalType: 'string[]',
              name: '_options',
              type: 'string[]'
            },
            {
              internalType: 'bytes[]',
              name: '_optionInfo',
              type: 'bytes[]'
            },
            {
              internalType: 'string',
              name: '_metadata',
              type: 'string'
            },
            {
              internalType: 'uint256',
              name: '_startTime',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_endTime',
              type: 'uint256'
            },
            {
              internalType: 'enum DomainObjs.Mode',
              name: '_mode',
              type: 'uint8'
            },
            {
              components: [
                {
                  internalType: 'uint256',
                  name: 'x',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256',
                  name: 'y',
                  type: 'uint256'
                }
              ],
              internalType: 'struct DomainObjs.PublicKey',
              name: '_coordinatorPubKey',
              type: 'tuple'
            },
            {
              internalType: 'address[]',
              name: '_relayers',
              type: 'address[]'
            },
            {
              internalType: 'uint256',
              name: '_eventId',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer1',
              type: 'uint256'
            },
            {
              internalType: 'uint256',
              name: '_signer2',
              type: 'uint256'
            },
            {
              internalType: 'address',
              name: '_verifier',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: '_voiceCreditsBalance',
              type: 'uint256'
            }
          ],
          name: 'createPollWithZupass',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ]
    }
  }
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;

// Abi consists of only used functions
// createPoll
// createPollWithFreeForAll
// createPollWithEAS
// createPollWithHats
// createPollWithMerkle
// createPollWithSemaphore
// createPollWithToken
// createPollWithZupass
// createPollWithERC20
// createPollWithERC20Votes
// createPollWithGitcoin
// createPollWithAnonAadhaar
