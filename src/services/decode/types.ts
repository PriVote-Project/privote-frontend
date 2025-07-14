import { Hex } from 'viem'

export interface Token {
  address: Hex
  decimals: number
  symbol: string
  name: string
}

export type AnonAadhaarPolicyData = {
  verifier: Hex
  nullifierSeed: bigint
}

export type TokenPolicyData = {
  token: Token
}

export type ERC20PolicyData = {
  token: Token
  threshold: bigint
}

export type PolicyData =
  | AnonAadhaarPolicyData
  | TokenPolicyData
  | ERC20PolicyData
  | Record<string, never>
