# Feature 2.1: Pet Canvas Rendering & Sprite Setup

This document outlines how the pet is drawn in the application. It uses inline SVG vectors styled to appear as premium pixel art, avoiding external assets.

---

## 📋 Requirements
- Render the character inside a dedicated viewport.
- Build vector representation states for the pet corresponding to different moods: *idle*, *happy*, *hungry*, *tired*, *sleeping*, *eating*.
- Ensure the canvas handles responsive sizing (high DPI / retina screens).
- Support soft shadow rendering underneath the pet.

## 🎨 Aesthetic Specifications
- **Character Design**: A mythical wood-spirit / fox companion inspired by Japanese folklore (like a tiny *Kitsune* or *Kodama*). It has cute pointed ears, minimalist dot eyes, and a bushy tail.
- **Color Consistency**: The pet's main skin/fur adjusts slightly or contrasts elegantly against the theme background using transparent SVG overlays or stroke controls.
- **Shadow**: A soft oval shadow underneath the pet that pulses/scales during idle animations to ground the pet in its space.

## 💻 Code Structure

### 1. Sprite Vector Configurations (`src/components/PetSprites.tsx`)
Rather than relying on png image assets, we construct state-specific inline SVGs representing our pet (Kitsune wood-spirit).

```tsx
import React from 'react';

interface SpriteProps {
  mood: 'idle' | 'happy' | 'hungry' | 'tired' | 'sleeping' | 'eating';
}

export const PetSprite: React.FC<SpriteProps> = ({ mood }) => {
  // Common details: kitsune body shape, whiskers, tail.
  switch (mood) {
    case 'happy':
      return (
        <svg viewBox="0 0 100 100" className="pet-svg happy-state">
          {/* Fox Body */}
          <path d="M30 70 L70 70 L60 40 L40 40 Z" fill="var(--color-primary-light)" />
          {/* Pointed Ears */}
          <polygon points="30,40 25,20 40,35" fill="var(--color-primary)" />
          <polygon points="70,40 75,20 60,35" fill="var(--color-primary)" />
          {/* Cheerful Happy Eyes (Arched lines) */}
          <path d="M 38 45 Q 43 38 48 45" stroke="var(--color-text-main)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 52 45 Q 57 38 62 45" stroke="var(--color-text-main)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Rosy Cheeks */}
          <circle cx="34" cy="50" r="4" fill="var(--color-primary)" opacity="0.6" />
          <circle cx="66" cy="50" r="4" fill="var(--color-primary)" opacity="0.6" />
          {/* Small nose & mouth */}
          <path d="M 49 50 Q 50 53 51 50" stroke="var(--color-text-main)" strokeWidth="2" fill="none" />
          {/* Tail wagging (Rotated) */}
          <path d="M 60 65 Q 85 55 75 75 Z" fill="var(--color-primary)" className="tail-wag" />
        </svg>
      );

    case 'hungry':
      return (
        <svg viewBox="0 0 100 100" className="pet-svg hungry-state">
          <path d="M30 70 L70 70 L60 42 L40 42 Z" fill="var(--color-primary-light)" />
          <polygon points="30,42 22,25 38,38" fill="var(--color-primary)" />
          <polygon points="70,42 78,25 62,38" fill="var(--color-primary)" />
          {/* Sad/droopy Eyes */}
          <circle cx="43" cy="48" r="2.5" fill="var(--color-text-main)" />
          <circle cx="57" cy="48" r="2.5" fill="var(--color-text-main)" />
          {/* Sweat drop (representing hunger/concern) */}
          <path d="M 68 35 Q 73 43 68 45 Q 63 43 68 35" fill="#5D9CEC" className="sweat-drop" />
          {/* Drooping mouth */}
          <path d="M 47 55 Q 50 51 53 55" stroke="var(--color-text-main)" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'tired':
      return (
        <svg viewBox="0 0 100 100" className="pet-svg tired-state">
          {/* Lying down shape */}
          <path d="M25 75 L75 75 L65 50 L35 50 Z" fill="var(--color-primary-light)" opacity="0.8" />
          <polygon points="32,50 25,35 40,47" fill="var(--color-primary)" />
          <polygon points="68,50 75,35 60,47" fill="var(--color-primary)" />
          {/* Sleepy half-closed eyes */}
          <line x1="38" y1="52" x2="46" y2="52" stroke="var(--color-text-main)" strokeWidth="2.5" />
          <line x1="54" y1="52" x2="62" y2="52" stroke="var(--color-text-main)" strokeWidth="2.5" />
        </svg>
      );

    case 'sleeping':
      return (
        <svg viewBox="0 0 100 100" className="pet-svg sleeping-state">
          {/* Lying down fully flat */}
          <path d="M20 80 L80 80 L70 58 L30 58 Z" fill="var(--color-primary-light)" opacity="0.6" />
          {/* Drooped ears */}
          <polygon points="28,58 20,48 35,55" fill="var(--color-primary)" />
          <polygon points="72,58 80,48 65,55" fill="var(--color-primary)" />
          {/* Closed content eyes (curved down) */}
          <path d="M 37 62 Q 41 65 45 62" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" />
          <path d="M 55 62 Q 59 65 63 62" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" />
        </svg>
      );

    default: // 'idle' / default state
      return (
        <svg viewBox="0 0 100 100" className="pet-svg idle-state">
          {/* Kitsune Body */}
          <path d="M30 70 L70 70 L60 40 L40 40 Z" fill="var(--color-primary-light)" />
          {/* Pointed Ears */}
          <polygon points="30,40 25,18 40,35" fill="var(--color-primary)" />
          <polygon points="70,40 75,18 60,35" fill="var(--color-primary)" />
          {/* Regular Alert Eyes */}
          <circle cx="43" cy="46" r="3" fill="var(--color-text-main)" />
          <circle cx="57" cy="46" r="3" fill="var(--color-text-main)" />
          <path d="M 48 51 Q 50 53 52 51" stroke="var(--color-text-main)" strokeWidth="2" fill="none" />
          {/* Soft tail */}
          <path d="M 60 65 Q 80 50 72 70 Z" fill="var(--color-primary)" className="tail-sway" />
        </svg>
      );
  }
};
```

### 2. Container Layout Setup (`src/components/PetDisplay.tsx`)
Binds the SVG character inside the responsive washi box.

```tsx
import React from 'react';
import { PetSprite } from './PetSprites';
import './PetDisplay.css';

interface PetDisplayProps {
  mood: 'idle' | 'happy' | 'hungry' | 'tired' | 'sleeping' | 'eating';
}

export const PetDisplay: React.FC<PetDisplayProps> = ({ mood }) => {
  return (
    <div className="pet-display-wrapper">
      <div className="pet-canvas-area">
        <PetSprite mood={mood} />
      </div>
      {/* Grounding Shadow */}
      <div className={`pet-shadow ${mood === 'sleeping' ? 'sleeping-shadow' : ''}`} />
    </div>
  );
};
```

### 3. Styled Canvas Area Layout (`src/components/PetDisplay.css`)
```css
.pet-display-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: radial-gradient(circle at 50% 50%, var(--color-bg-base) 0%, rgba(255,255,255,0) 70%);
  border-radius: 8px;
  padding: 16px;
}

.pet-canvas-area {
  width: 120px;
  height: 120px;
  z-index: 2;
  transition: transform 0.3s ease;
}

.pet-svg {
  width: 100%;
  height: 100%;
}

/* Grounding Shadow design */
.pet-shadow {
  position: absolute;
  bottom: 30px;
  width: 70px;
  height: 10px;
  background-color: var(--color-text-muted);
  opacity: 0.15;
  border-radius: 50%;
  z-index: 1;
  animation: shadowPulse 3s infinite ease-in-out;
}

/* Idle animation pulses shadow scale */
@keyframes shadowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.12;
  }
}

.pet-shadow.sleeping-shadow {
  width: 85px;
  animation: shadowSleep 4s infinite ease-in-out;
}

@keyframes shadowSleep {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(0.95); opacity: 0.08; }
}
```

## 🔍 Verification & Checklist
- [ ] Viewport renders correctly on Retina display screens without blurring (accomplished via SVG).
- [ ] SVG fills utilize CSS variables correctly (`var(--color-primary-light)`), rendering color matches on theme switch.
- [ ] Oval ground shadow matches the pet width and aligns centrally.
- [ ] The SVG imports/modules trigger no TypeScript compilation errors.
