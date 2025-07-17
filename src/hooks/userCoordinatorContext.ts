import { CoordinatorContext } from '@/contexts/CoordinatorContext';
import { type ICoordinatorContextType } from '@/contexts/types';
import { useContext } from 'react';

export const useCoordinatorContext = (): ICoordinatorContextType => {
  const coordinatorContext = useContext(CoordinatorContext);

  if (!coordinatorContext) {
    throw new Error('Should use context inside provider.');
  }

  return coordinatorContext;
};
