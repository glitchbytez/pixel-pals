import { useState, useEffect } from 'react';
import { type MoodType } from '../components/PetSprites';

export { type MoodType };

export const usePetAnimation = (externalMood: MoodType) => {
  const [currentMood, setCurrentMood] = useState<MoodType>(externalMood);

  // Sync external changes (needs status overrides happy, tired, hungry, sleeping)
  useEffect(() => {
    setCurrentMood(externalMood);
  }, [externalMood]);

  useEffect(() => {
    // If the pet is sleeping, tired, or eating, do not trigger random idle shifts.
    if (externalMood !== 'idle') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const runRandomBehavior = () => {
      // Pick random behaviors: 75% standard idle, 15% happy stretch, 10% brief sleep
      const rand = Math.random();
      if (rand > 0.85) {
        setCurrentMood('happy');
        // Return to idle after 1.5s
        timeoutId = setTimeout(() => {
          setCurrentMood('idle');
          scheduleNext();
        }, 1500);
      } else if (rand > 0.75) {
        setCurrentMood('tired');
        timeoutId = setTimeout(() => {
          setCurrentMood('idle');
          scheduleNext();
        }, 2000);
      } else {
        setCurrentMood('idle');
        scheduleNext();
      }
    };

    const scheduleNext = () => {
      // Trigger random behaviors every 6 to 12 seconds
      const nextInterval = Math.floor(Math.random() * 6000) + 6000;
      timeoutId = setTimeout(runRandomBehavior, nextInterval);
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [externalMood]);

  return currentMood;
};
