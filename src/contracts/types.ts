import type { Abi, Address } from 'viem'
export type InheritedFunctions = { readonly [key: string]: string }

export type GenericContract = {
  address: Address
  abi: Abi
  inheritedFunctions?: InheritedFunctions
  external?: true
  deploymentBlockNumber?: number
}

export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: GenericContract
  }
}
