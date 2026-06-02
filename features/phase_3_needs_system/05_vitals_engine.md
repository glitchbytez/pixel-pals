# Feature 3.1: Vitals Engine (Hunger & Energy State Hook)

This document describes the simulation backend, which tracks the pet's metabolic values (Hunger, Energy) over time and translates them into appropriate emotional states.

---

## 📋 Requirements
- Manage pet vitals (`hunger` from 0-100, `energy` from 0-100, `isSleeping` boolean).
- Save and load vitals to `localStorage` periodically to ensure persistence across page reloads.
- Implement a background loop that depletes hunger and energy.
- Map the numbers to a primary `baseMood` flag:
  - If `isSleeping` is true -> `sleeping`
  - If `energy <= 25` -> `tired`
  - If `hunger <= 30` -> `hungry`
  - Otherwise -> `idle`

## 🎨 Aesthetic Specifications
- **Passive Decay**: Metabolic decay should feel gradual and non-threatening. Decay ticks happen slowly (e.g. hunger decreases by 1 point every 3 minutes, energy by 1 point every 2 minutes) to not stress the user.
- **Sleep Restores Energy**: When sleeping, energy is restored (+2 per second) while hunger decays slightly faster (+1.5x) to model metabolism.

## 💻 Code Structure

### 1. Custom Vitals Context & Hook (`src/context/VitalsContext.tsx`)
Create a custom provider enclosing all state, timers, and storage operations.

```typescript
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MoodType } from '../hooks/usePetAnimation';

interface VitalsState {
  hunger: number;     // 0 = full/satisfied, 100 = starving
  energy: number;     // 100 = active, 0 = exhausted
  isSleeping: boolean;
  baseMood: MoodType;
}

interface VitalsContextProps extends VitalsState {
  feedPet: () => void;
  toggleSleep: () => void;
  petInteraction: () => void;
  resetVitals: () => void;
}

const VitalsContext = createContext<VitalsContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'desk-pet-vitals';

const INITIAL_VITALS = {
  hunger: 20, // starts slightly hungry
  energy: 80,
  isSleeping: false,
};

export const VitalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hunger, setHunger] = useState<number>(INITIAL_VITALS.hunger);
  const [energy, setEnergy] = useState<number>(INITIAL_VITALS.energy);
  const [isSleeping, setIsSleeping] = useState<boolean>(INITIAL_VITALS.isSleeping);
  const [baseMood, setBaseMood] = useState<MoodType>('idle');

  // Ref to hold exact values for timeout loops
  const statsRef = useRef({ hunger, energy, isSleeping });
  statsRef.current = { hunger, energy, isSleeping };

  // 1. Load initial state
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHunger(Math.max(0, Math.min(100, parsed.hunger)));
        setEnergy(Math.max(0, Math.min(100, parsed.energy)));
        setIsSleeping(parsed.isSleeping || false);
      } catch (e) {
        console.error("Failed to load pet vitals:", e);
      }
    }
  }, []);

  // 2. Persist states to storage on changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ hunger, energy, isSleeping }));
  }, [hunger, energy, isSleeping]);

  // 3. Compute base mood on vitals state changes
  useEffect(() => {
    if (isSleeping) {
      setBaseMood('sleeping');
    } else if (energy <= 25) {
      setBaseMood('tired');
    } else if (hunger >= 70) { // hunger scale: 100 is most hungry
      setBaseMood('hungry');
    } else {
      setBaseMood('idle');
    }
  }, [hunger, energy, isSleeping]);

  // 4. Background decay / recovery loop (ticks every 10 seconds for smoothness)
  useEffect(() => {
    const interval = setInterval(() => {
      const { hunger: currHunger, energy: currEnergy, isSleeping: currSleeping } = statsRef.current;

      if (currSleeping) {
        // Sleep state: Restore energy, increase hunger moderately
        setEnergy((e) => Math.min(100, e + 5));
        setHunger((h) => Math.min(100, h + 1.5));
        
        // Auto wake up when full energy
        if (currEnergy >= 100) {
          setIsSleeping(false);
        }
      } else {
        // Active state: slowly deplete energy, increase hunger
        setEnergy((e) => Math.max(0, e - 1));
        setHunger((h) => Math.min(100, h + 1));
      }
    }, 15000); // 15-second tick intervals

    return () => clearInterval(interval);
  }, []);

  // Vitals Actions
  const feedPet = () => {
    if (isSleeping) return;
    setHunger((h) => Math.max(0, h - 35)); // Eating decreases hunger
  };

  const toggleSleep = () => {
    setIsSleeping((prev) => !prev);
  };

  const petInteraction = () => {
    if (isSleeping) return;
    setEnergy((e) => Math.min(100, e + 10)); // Petting restores energy
  };

  const resetVitals = () => {
    setHunger(INITIAL_VITALS.hunger);
    setEnergy(INITIAL_VITALS.energy);
    setIsSleeping(INITIAL_VITALS.isSleeping);
  };

  return (
    <VitalsContext.Provider value={{
      hunger,
      energy,
      isSleeping,
      baseMood,
      feedPet,
      toggleSleep,
      petInteraction,
      resetVitals
    }}>
      {children}
    </VitalsContext.Provider>
  );
};

export const useVitals = () => {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within a VitalsProvider');
  }
  return context;
};
```

## 🔍 Verification & Checklist
- [ ] Vitals decay calculations occur accurately inside the background tick loops.
- [ ] Vitals values are capped securely between `0` and `100`.
- [ ] Base mood state transitions correctly as vitals cross thresholds (e.g. `energy <= 25` switches mood to `tired`).
- [ ] Putting pet to sleep blocks inputs and restores energy dynamically.
