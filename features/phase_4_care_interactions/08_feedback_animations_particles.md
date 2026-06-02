# Feature 4.2: Interaction Particles & Feedback Animation Loops

This document details how particle overlays (floating sakura blossoms, hearts, or crumbs) render above the character when clicked, creating a premium visual response.

---

## 📋 Requirements
- Render particle bursts in response to clicks (Sakura petals for Petting, rice grains/bites for Feeding).
- Trigger a temporary override on the character sprite (`happy` or `eating` state) for 1.5 - 2 seconds.
- Automatically clean up particles from React state to avoid performance leaks.

## 🎨 Aesthetic Specifications
- **Sakura Blossoms**: Thin, rotating pink petals (`--color-primary-light` and `--color-primary`) floating upwards with randomized speeds, scaling down to 0 before disappearing.
- **Micro-animations**: A slight "jump" or bounce effect applied to the pet frame itself (`transform: translateY(-8px)`) matching the particle burst timing.

## 💻 Code Structure

### 1. Particle Types & Hook (`src/hooks/useParticles.ts`)
Create a custom hook to spawn, tick, and cull particles.

```typescript
import { useState, useCallback } from 'react';

export interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  angle: number;
  type: 'sakura' | 'rice';
}

export const useParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const spawnParticles = useCallback((type: 'sakura' | 'rice') => {
    const newParticles: Particle[] = Array.from({ length: 8 }).map((_, index) => ({
      id: Date.now() + index + Math.random(),
      // Spawn centered with minor offset
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      scale: Math.random() * 0.4 + 0.6,
      angle: Math.random() * 360,
      type,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Cull after animation ends (1.2 seconds)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 1200);
  }, []);

  return { particles, spawnParticles };
};
```

### 2. Particle Overlay Canvas Component (`src/components/ParticleLayer.tsx`)
Renders the spawned particles above the pet display:

```tsx
import React from 'react';
import { Particle } from '../hooks/useParticles';
import './ParticleLayer.css';

interface ParticleLayerProps {
  particles: Particle[];
}

export const ParticleLayer: React.FC<ParticleLayerProps> = ({ particles }) => {
  return (
    <div className="particle-layer-container">
      {particles.map((p) => {
        const xOffset = `${Math.sin(p.angle) * 30}px`;
        const style = {
          left: `${p.x}%`,
          top: `${p.y}%`,
          transform: `scale(${p.scale}) rotate(${p.angle}deg)`,
          '--x-offset': xOffset,
        } as React.CSSProperties;

        return (
          <div
            key={p.id}
            className={`particle ${p.type === 'sakura' ? 'sakura-petal' : 'rice-grain'}`}
            style={style}
          />
        );
      })}
    </div>
  );
};
```

### 3. CSS Animations for Particles (`src/components/ParticleLayer.css`)
```css
.particle-layer-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 12px;
  height: 12px;
  opacity: 0;
  pointer-events: none;
}

/* Sakura Blossom (Petting feedback) */
.sakura-petal {
  background-color: var(--color-primary-light);
  border-radius: 10px 0 10px 10px; /* Sakura petal shape */
  transform-origin: center;
  animation: floatSakura 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes floatSakura {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  100% {
    transform: translate(var(--x-offset, 25px), -60px) scale(0.4) rotate(180deg);
    opacity: 0;
  }
}

/* Rice Grain (Feeding feedback) */
.rice-grain {
  background-color: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; /* Rice grain oval */
  animation: scatterRice 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}

@keyframes scatterRice {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x-offset, -15px), 25px) scale(0) rotate(90deg);
    opacity: 0;
  }
}
```

## 🔍 Verification & Checklist
- [ ] Clicking Feed correctly triggers rice particles dropping.
- [ ] Clicking Pet triggers sakura blossom petals floating up.
- [ ] Particle items are garbage collected/removed from arrays after 1.2 seconds, preventing DOM accumulation leaks.
- [ ] The parent card component applies a temporary bounce styling when triggered.
