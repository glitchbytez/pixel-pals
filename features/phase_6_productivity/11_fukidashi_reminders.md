# Feature 6.1: Active Timer Hook & Fukidashi Speech Dialogue Engine

This document details the scheduling hook and speech bubble overlay (*Fukidashi* - 吹き出し) used to alert users of stretch breaks, water intervals, and focus landmarks.

---

## 📋 Requirements
- Implement a countdown timer (default 45 minutes) that runs in the background.
- Render a speech bubble callout styled like traditional manga/ink panels directly above the character sprite.
- Dynamically toggle bubble contents based on random positive prompts, stretch guides, or metabolic vitals (e.g. if the pet is hungry, the bubble states: *"Feed me!"*).
- Auto-dismiss speech bubbles after 8 seconds, or offer a "Close" checkmark.

## 🎨 Aesthetic Specifications
- **Fukidashi Structure**: Hand-drawn look speech bubbles. Implement this using CSS borders or curved SVG shapes with solid background layers, thin borders (`--color-text-main`), and small pointers pointing downwards toward the pet.
- **Japanese Callout Text**: Display prompts with dual English-Japanese styling. E.g., *"そろそろお茶にしませんか？ (How about a matcha break?)"*.

## 💻 Code Structure

### 1. Fukidashi Speech Bubble Component (`src/components/Fukidashi.tsx`)
```tsx
import React from 'react';
import './Fukidashi.css';

interface FukidashiProps {
  message: string;
  onDismiss: () => void;
}

export const Fukidashi: React.FC<FukidashiProps> = ({ message, onDismiss }) => {
  return (
    <div className="fukidashi-bubble-wrapper">
      <div className="fukidashi-bubble">
        <p className="fukidashi-text">{message}</p>
        <button
          className="fukidashi-close-btn"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          ✓
        </button>
        {/* Pointer tip pointing to pet */}
        <div className="fukidashi-pointer" />
      </div>
    </div>
  );
};
```

### 2. Speech Bubble Styling (`src/components/Fukidashi.css`)
```css
.fukidashi-bubble-wrapper {
  position: absolute;
  bottom: 145px; /* Sit right above the pet sprite */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 85%;
  animation: fukidashiPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes fukidashiPop {
  0% { transform: translateX(-50%) scale(0.85); opacity: 0; }
  100% { transform: translateX(-50%) scale(1); opacity: 1; }
}

.fukidashi-bubble {
  position: relative;
  background-color: var(--color-bg-card);
  border: 2px solid var(--color-text-main); /* Bold outline like Manga art */
  border-radius: 12px;
  padding: 12px 32px 12px 14px;
  box-shadow: 4px 4px 0px var(--color-border); /* Retro layout shadow block */
}

.fukidashi-text {
  font-family: 'Noto Serif JP', serif;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  color: var(--color-text-main);
  text-align: left;
}

.fukidashi-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 2px 4px;
}

.fukidashi-close-btn:hover {
  color: var(--color-primary);
}

/* Downward indicator pointer */
.fukidashi-pointer {
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 14px;
  height: 14px;
  background-color: var(--color-bg-card);
  border-right: 2px solid var(--color-text-main);
  border-bottom: 2px solid var(--color-text-main);
  z-index: -1;
}
```

### 3. Active Stretch Timer Loop Hook (`src/hooks/useReminderTimer.ts`)
Tracks inactivity and prompts active notifications:

```typescript
import { useState, useEffect, useCallback } from 'react';

const SUGGESTIONS = [
  'そろそろ深呼吸しませんか？ (How about a deep breath?)',
  'お茶を飲んで、一息入れましょう。(Time for a green tea break.)',
  '肩の力を抜いて、ストレッチ！ (Relax your shoulders and stretch!)',
  '遠くの景色を20秒間見つめて。(Look at something far away for 20s.)',
  '背筋を伸ばして、リフレッシュ。(Straighten your spine to refresh.)',
];

export const useReminderTimer = (
  intervalMinutes: number = 45,
  isPetSleeping: boolean
) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const triggerRandomSuggestion = useCallback(() => {
    if (isPetSleeping) return;
    const randomIndex = Math.floor(Math.random() * SUGGESTIONS.length);
    setActiveMessage(SUGGESTIONS[randomIndex]);
  }, [isPetSleeping]);

  useEffect(() => {
    if (isPetSleeping) {
      setActiveMessage(null);
      return;
    }

    // Set reminder interval (convert to milliseconds)
    const msInterval = intervalMinutes * 60 * 1000;

    const timer = setInterval(() => {
      triggerRandomSuggestion();
    }, msInterval);

    return () => clearInterval(timer);
  }, [intervalMinutes, isPetSleeping, triggerRandomSuggestion]);

  const dismissMessage = () => {
    setActiveMessage(null);
  };

  return { activeMessage, triggerRandomSuggestion, dismissMessage };
};
```

## 🔍 Verification & Checklist
- [ ] Speech bubble positions centrally above the character and aligns the pointer cleanly.
- [ ] Dismiss button closes dialog and clears state memory.
- [ ] Reminders are fully blocked/silenced when the pet is in Sleep mode.
- [ ] Prompt message list features correct Japanese characters without layout overflows.
