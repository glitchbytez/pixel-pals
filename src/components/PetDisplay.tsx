import React from 'react';
import { PetSprite, type MoodType } from './PetSprites';
import './PetDisplay.css';

interface PetDisplayProps {
  mood: MoodType;
}

export const PetDisplay: React.FC<PetDisplayProps> = ({ mood }) => {
  return (
    <div className="pet-display-wrapper">
      <div className="pet-canvas-area">
        <PetSprite mood={mood} />
      </div>
      {/* Grounding Shadow */}
      <div className={`pet-shadow ${mood === 'sleeping' || mood === 'tired' ? 'sleeping-shadow' : ''}`} />
    </div>
  );
};
