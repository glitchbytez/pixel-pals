# Feature 6.2: Snack Reward Loop & Keyboard Active Detection

This document covers the gamified reward loop and user activity detection, rewarding active breaks with inventory snacks to restore the pet's metabolic vitals.

---

## 📋 Requirements
- Build an activity tracking listener that pauses the productivity timer if the user leaves their desk (e.g. no keyboard/mouse inputs for 10 minutes).
- Implement a "Snack Stock" inventory counter.
- Grant +1 Snack (like a Dango 🍡 or Taiyaki 🐟) every time a stretch reminder is successfully completed and dismissed.
- Tie the snacks inventory back into the Care Dock so users feed the pet using their earned stock.

## 🎨 Aesthetic Specifications
- **Snack Inventory Stamp**: Render the inventory count as an elegant wax stamp or calligraphic label (e.g. `持物 (Snacks)`) with individual items represented by high-quality symbols:
  - 🍡 (Mitarashi Dango - Sweet dumplings)
  - 🍘 (Senbei - Rice cracker)
- **Active Inactivity Transitions**: When the user is flagged as "Away", fade the pet dashboard slightly to evoke a sleeping garden tranquility.

## 💻 Code Structure

### 1. Unified Activity & Inventory Provider (`src/context/GameContext.tsx`)
This context tracks user inputs to determine presence, and handles snack rewards.

```typescript
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface GameContextProps {
  snacks: number;
  isAway: boolean;
  spendSnack: () => boolean; // returns true if successful
  addSnack: (amount?: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'desk-pet-game-state';
const AWAY_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes of complete inactivity

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snacks, setSnacks] = useState<number>(3); // start with 3 snacks
  const [isAway, setIsAway] = useState<boolean>(false);
  const lastActiveRef = useRef<number>(Date.now());

  // 1. Load inventory state
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSnacks(parsed.snacks ?? 3);
      } catch (e) {
        console.error("Failed to load game state:", e);
      }
    }
  }, []);

  // 2. Persist inventory state
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ snacks }));
  }, [snacks]);

  // 3. User activity listeners (Mouse, Touch, Keydown)
  useEffect(() => {
    const handleActivity = () => {
      lastActiveRef.current = Date.now();
      if (isAway) {
        setIsAway(false);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);

    // Watcher interval checking inactivity delta
    const checker = setInterval(() => {
      const delta = Date.now() - lastActiveRef.current;
      if (delta > AWAY_THRESHOLD_MS && !isAway) {
        setIsAway(true);
      }
    }, 15000); // Check status every 15 seconds

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(checker);
    };
  }, [isAway]);

  const spendSnack = () => {
    if (snacks <= 0) return false;
    setSnacks((prev) => prev - 1);
    return true;
  };

  const addSnack = (amount: number = 1) => {
    setSnacks((prev) => prev + amount);
  };

  const resetGame = () => {
    setSnacks(3);
    setIsAway(false);
  };

  return (
    <GameContext.Provider value={{
      snacks,
      isAway,
      spendSnack,
      addSnack,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
```

### 2. Updating Care Dock for Snacks Integration
Connect [CareDock.tsx](file:///home/timbla/code/vite-project/features/phase_4_care_interactions/07_care_ui_dock.md) to check snack availability:

```tsx
// Inside Feed Action click handler:
const { snacks, spendSnack } = useGame();
const { feedPet, isSleeping } = useVitals();

const handleFeedClick = () => {
  if (isSleeping) return;
  if (snacks > 0) {
    spendSnack();
    feedPet();
    onTriggerInteraction('feed');
  } else {
    // Phase 6.1: Show speech bubble "No snacks left!"
  }
};
```

### 3. Displaying inventory Count (`src/components/InventoryLabel.tsx`)
```tsx
import React from 'react';
import { useGame } from '../context/GameContext';
import './InventoryLabel.css';

export const InventoryLabel: React.FC = () => {
  const { snacks } = useGame();

  return (
    <div className="inventory-stamp">
      <span className="stamp-label">持物 (Snacks)</span>
      <span className="stamp-count font-outfit">🍡 × {snacks}</span>
    </div>
  );
};
```

```css
/* InventoryLabel.css */
.inventory-stamp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg-base);
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: -12px;
}

.stamp-label {
  font-family: 'Noto Serif JP', serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.stamp-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-main);
}
```

## 🔍 Verification & Checklist
- [ ] Inactivity triggers correctly when browser/window is left idle for threshold.
- [ ] Inactivity check loops pause productivity notifications to prevent background spam.
- [ ] Dismissing stretch alerts increments snack quantity in local state.
- [ ] Attempting to Feed with 0 snacks blocks vitals updates and prompts a feedback bubble.
