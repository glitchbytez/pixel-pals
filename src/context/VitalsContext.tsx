import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { type MoodType } from '../hooks/usePetAnimation';

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
  useEffect(() => {
    statsRef.current = { hunger, energy, isSleeping };
  }, [hunger, energy, isSleeping]);

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

  // 4. Background decay / recovery loop (ticks every 15 seconds for smoothness)
  useEffect(() => {
    const interval = setInterval(() => {
      const { energy: currEnergy, isSleeping: currSleeping } = statsRef.current;

      if (currSleeping) {
        // Sleep state: Restore energy, increase hunger moderately
        setEnergy((e) => Math.min(100, e + 5));
        setHunger((h) => Math.min(100, h + 1.5));
        // Auto wake up when full energy
        if (currEnergy + 5 >= 100) {
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
