import React from 'react';
import { PetDisplay } from './PetDisplay';
import { usePetAnimation, type MoodType } from '../hooks/usePetAnimation';

interface WrapperProps {
  baseMood: MoodType; // Supplied by Vitals engine (Phase 3)
}

export const PetDisplayWrapper: React.FC<WrapperProps> = ({ baseMood }) => {
  const activeMood = usePetAnimation(baseMood);

  return <PetDisplay mood={activeMood} />;
};
