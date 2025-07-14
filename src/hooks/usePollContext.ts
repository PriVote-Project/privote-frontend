'use client'
import { useContext } from 'react'
import { type IPollContextType } from '../contexts/types'
import { PollContext } from '../contexts/PollContext'

export const usePoll = (): IPollContextType => {
  const pollContext = useContext(PollContext)

  if (!pollContext) {
    throw new Error('Should use context inside provider.')
  }

  return pollContext
}
