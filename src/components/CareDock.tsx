import React from 'react';
import { useVitals } from '../context/VitalsContext';
import './CareDock.css';

interface CareDockProps {
  onTriggerInteraction: (action: 'pet' | 'feed') => void;
}

export const CareDock: React.FC<CareDockProps> = ({ onTriggerInteraction }) => {
  const { isSleeping, feedPet, toggleSleep, petInteraction } = useVitals();

  const handleFeed = () => {
    if (isSleeping) return;
    feedPet();
    onTriggerInteraction('feed');
  };

  const handlePet = () => {
    if (isSleeping) return;
    petInteraction();
    onTriggerInteraction('pet');
  };

  return (
    <div className={`care-dock ${isSleeping ? 'is-sleeping-dock' : ''}`}>
      {/* 1. Feed Button */}
      <button
        onClick={handleFeed}
        disabled={isSleeping}
        className="hanko-btn feed-btn"
        aria-label="Feed pet"
      >
        <span className="hanko-icon">🍙</span>
        <span className="hanko-label">ご飯</span>
      </button>

      {/* 2. Pet Button */}
      <button
        onClick={handlePet}
        disabled={isSleeping}
        className="hanko-btn pet-btn"
        aria-label="Pet companion"
      >
        <span className="hanko-icon">🌸</span>
        <span className="hanko-label">撫でる</span>
      </button>

      {/* 3. Sleep Toggle Button */}
      <button
        onClick={toggleSleep}
        className={`hanko-btn sleep-btn ${isSleeping ? 'active' : ''}`}
        aria-label={isSleeping ? "Wake up pet" : "Put pet to sleep"}
      >
        <span className="hanko-icon">{isSleeping ? '🏮' : '💤'}</span>
        <span className="hanko-label">{isSleeping ? '起す' : '睡眠'}</span>
      </button>
    </div>
  );
};
