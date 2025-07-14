import { PollPolicyType } from '@/types'
import { decodeAbiParameters, Hex, parseAbiParameters, PublicClient } from 'viem'
import { AnonAadhaarPolicyData, TokenPolicyData, ERC20PolicyData, Token, PolicyData } from './types'
import ERCAbi from '@/abi/ERC'

export class DecodeService {
  constructor(
    private policyTrait: PollPolicyType,
    private policyData: Hex,
    private client: PublicClient
  ) {}

  private getAbiString(): string {
    switch (this.policyTrait) {
      case PollPolicyType.AnonAadhaar:
        return 'address verifier, uint256 nullifierSeed'
      case PollPolicyType.Token:
        return 'address token'
      case PollPolicyType.ERC20:
        return 'address token, uint256 threshold'
      default:
        return ''
    }
  }

  private async fetchTokenDetails(address: Hex): Promise<Token> {
    const ercContract = {
      abi: ERCAbi,
      address
    }

    try {
      const result = await this.client.multicall({
        contracts: [
          { ...ercContract, functionName: 'name' },
          { ...ercContract, functionName: 'symbol' },
          { ...ercContract, functionName: 'decimals' }
        ]
      })

      return {
        address,
        name: result[0].status === 'success' ? result[0].result : '',
        symbol: result[1].status === 'success' ? result[1].result : '',
        decimals: result[2].status === 'success' ? Number(result[2].result) : 18
      }
    } catch (error) {
      console.error('Error fetching token details:', error)
      return {
        address,
        name: '',
        symbol: '',
        decimals: 18
      }
    }
  }

  async decode(): Promise<PolicyData> {
    const abiString = this.getAbiString()
    if (!abiString) {
      return {}
    }

    try {
      const decodedValues = decodeAbiParameters(parseAbiParameters(abiString), this.policyData)

      switch (this.policyTrait) {
        case PollPolicyType.AnonAadhaar: {
          const [verifier, nullifierSeed] = decodedValues as [Hex, bigint]
          return {
            verifier,
            nullifierSeed
          } as AnonAadhaarPolicyData
        }

        case PollPolicyType.Token: {
          const [tokenAddress] = decodedValues as [Hex]
          const tokenDetails = await this.fetchTokenDetails(tokenAddress)
          return {
            token: tokenDetails
          } as TokenPolicyData
        }

        case PollPolicyType.ERC20: {
          const [tokenAddress, threshold] = decodedValues as [Hex, bigint]
          const tokenDetails = await this.fetchTokenDetails(tokenAddress)
          return {
            token: tokenDetails,
            threshold
          } as ERC20PolicyData
        }

        default:
          return {}
      }
    } catch (error) {
      console.error('Error decoding policy data:', error)
      return {}
    }
  }
}
