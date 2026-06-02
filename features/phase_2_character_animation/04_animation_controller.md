# Feature 2.2: Idle State Management & Random Animation Controller

This document outlines the state engine that governs the random shifting of the pet’s idle activities (breathing, blinking, tail wagging, looking around) to make it feel organically alive.

---

## 📋 Requirements
- Build a timer engine that switches the pet's micro-actions (e.g. blinking, looking left, breathing, yawning) during idle states.
- Inject smooth CSS keyframe animations (body bobbing, tail wiggles) directly into the SVG components.
- Ensure temporary states (like blinking or happy jumps) automatically return to baseline idle.

## 🎨 Aesthetic Specifications
- **Natural Breathing**: The body of the pet should bob up and down slowly (`ease-in-out` curves, 3-4 second durations) to emulate sleep/rest.
- **Tail Swaying**: A gentle side-to-side rotation (`-5deg` to `5deg`) applied to the tail element.
- **Organic Blinking**: Blinking should occur randomly (e.g. every 4-8 seconds) for a fraction of a second, rather than on a robotic fixed frequency.

## 💻 Code Structure

### 1. Animated SVG Micro-interactions (`src/components/PetSprites.css`)
Add these dynamic animation keyframes for the SVG pieces:

```css
/* Breathing Bobbing */
.idle-state, .happy-state, .hungry-state {
  animation: breathingBob 4s infinite ease-in-out;
  transform-origin: bottom center;
}

@keyframes breathingBob {
  0%, 100% {
    transform: translateY(0) scaleY(1);
  }
  50% {
    transform: translateY(-2px) scaleY(1.02); /* Delicate stretching upward */
  }
}

/* Tail Waving */
.tail-sway {
  transform-origin: 60px 65px;
  animation: tailSway 3.5s infinite ease-in-out;
}

@keyframes tailSway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(8deg); }
}

/* Tail Wagging (Happy state) */
.tail-wag {
  transform-origin: 60px 65px;
  animation: tailWag 0.6s infinite ease-in-out;
}

@keyframes tailWag {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(15deg); }
}

/* Sweat Drop (Hungry state) */
.sweat-drop {
  animation: sweatFall 2s infinite ease-in;
  transform-origin: center;
}

@keyframes sweatFall {
  0% { transform: translateY(-5px); opacity: 0; }
  30% { opacity: 1; }
  80%, 100% { transform: translateY(5px); opacity: 0; }
}
```

### 2. State-driven Controller Hook (`src/hooks/usePetAnimation.ts`)
Creates a scheduler loop that dynamically alternates the sub-animations of the character:

```typescript
import { useState, useEffect } from 'react';

export type MoodType = 'idle' | 'happy' | 'hungry' | 'tired' | 'sleeping' | 'eating';

export const usePetAnimation = (externalMood: MoodType) => {
  const [currentMood, setCurrentMood] = useState<MoodType>(externalMood);

  // Sync external changes (needs status overrides happy, tired, hungry, sleeping)
  useEffect(() => {
    setCurrentMood(externalMood);
  }, [externalMood]);

  useEffect(() => {
    // If the pet is sleeping, tired, or eating, do not trigger random idle shifts.
    if (externalMood !== 'idle') return;

    let timeoutId: NodeJS.Timeout;

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
```

### 3. Integrated Display (`src/components/PetDisplayWrapper.tsx`)
```tsx
import React from 'react';
import { PetDisplay } from './PetDisplay';
import { usePetAnimation, MoodType } from '../hooks/usePetAnimation';

interface WrapperProps {
  baseMood: MoodType; // Supplied by Vitals engine (Phase 3)
}

export const PetDisplayWrapper: React.FC<WrapperProps> = ({ baseMood }) => {
  const activeMood = usePetAnimation(baseMood);

  return <PetDisplay mood={activeMood} />;
};
```

## 🔍 Verification & Checklist
- [ ] Tail and body animations scale/origin are pinned correctly relative to target elements (`transform-origin`).
- [ ] High-frequency state shifting is avoided (intervals are padded to at least 5s).
- [ ] Temporary state overrides (e.g. happy jump) cleanly revert to the base state.
- [ ] Disabling browser focus (e.g. background tab) doesn't leak timers (timers are properly cleared on unmount).
