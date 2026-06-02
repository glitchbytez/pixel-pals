# Feature 4.1: Care UI Dock & Action Controller

This document details the interface layout and logic for the action dock, where users feed, play with, or put the pet to sleep.

---

## 📋 Requirements
- Build a persistent footer dock containing care buttons.
- Connect action buttons to vitals actions:
  - **Pet**: Triggers brief *happy* state, updates energy.
  - **Feed (ご飯)**: Triggers brief *eating* transition state, decreases hunger.
  - **Sleep (睡眠)**: Toggles sleeping loop, disabling other actions during rest.
- Disable buttons logically if the pet is sleeping.

## 🎨 Aesthetic Specifications
- **Button Styling**: Rounded square buttons styled like traditional wooden chop seals (Hanko - 判子). Thin borders with inset/outset focus transitions.
- **Iconography**: Minimalist emojis or custom strokes (e.g. 🍙 for Onigiri/Feed, 🖐️ or 🌸 for Pet, 💤 or 🏮 for Sleep/Lantern).
- **Disabled State**: When sleeping, disabled buttons fade gracefully with lower opacity and a blurred effect rather than using a standard grey color.

## 💻 Code Structure

### 1. Care Dock Component (`src/components/CareDock.tsx`)
Connect the button controls to Vitals and UI handlers:

```tsx
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
```

### 2. Dock Styling (`src/components/CareDock.css`)
```css
.care-dock {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

/* Hanko / Wooden Seal button design */
.hanko-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.hanko-icon {
  font-size: 1.5rem;
  transition: transform 0.2s ease;
}

.hanko-label {
  font-family: 'Noto Serif JP', serif;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

/* Hover & Active Effects */
.hanko-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background-color: var(--color-bg-base);
}

.hanko-btn:hover:not(:disabled) .hanko-icon {
  transform: scale(1.15) rotate(-3deg);
}

.hanko-btn:active:not(:disabled) {
  transform: scale(0.96);
  background-color: var(--color-border);
}

/* Sleep Active State */
.hanko-btn.sleep-btn.active {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
}

.hanko-btn.sleep-btn.active .hanko-label {
  color: var(--color-text-main);
}

/* Disabled/Sleeping styling */
.hanko-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(1);
}
```

## 🔍 Verification & Checklist
- [ ] Active state toggles sleep mode variables immediately.
- [ ] Feeding and Petting buttons are physically disabled when the pet is asleep.
- [ ] Hover transformations (rotation, scaling) apply only when button is active.
- [ ] Buttons map layout changes smoothly when mobile viewport sizes shift.
