# Feature 5.2: Day/Night Environment Scenery & Background Layering

This document outlines the visual background scenery layers rendered behind the pet, which change elements depending on the active theme/day period.

---

## 📋 Requirements
- Render environmental decorations behind the pet container based on current active theme.
- Scenery variables include:
  - **Spring Garden (春庭)**: Falling cherry blossom petals, soft sunburst rays.
  - **Forest Bamboo (森林)**: Tall silhouette bamboo stalks in the background.
  - **Sunset Twilight (黄昏)**: Silhouette mountain ridges with an orange sun disc.
  - **Indigo Night (藍染)**: Floating stars, crescent moon, and a glowing paper lantern (Chōchin - 提灯).

## 🎨 Aesthetic Specifications
- **Minimalist Backdrop**: Decorations must remain low-contrast (`opacity: 0.15 - 0.35`) so they do not compete with the pet sprite or reduce visibility.
- **Micro-motions**: Background clouds float slowly; the night lantern has a warm glowing flicker effect.

## 💻 Code Structure

### 1. Scenery Canvas Layer (`src/components/EnvironmentalBackdrop.tsx`)
Render backdrop vectors dynamically styled via theme variable selectors.

```tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './EnvironmentalBackdrop.css';

export const EnvironmentalBackdrop: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="scenery-container">
      {/* 1. Theme-Specific SVG Decors */}
      {theme === 'spring-garden' && (
        <svg viewBox="0 0 100 100" className="scenery-svg">
          {/* Subtle sun ray filter */}
          <circle cx="10" cy="10" r="40" fill="var(--color-primary-light)" opacity="0.15" />
          {/* Falling petal decorations */}
          <path d="M20 15 Q25 20 20 25 Q15 20 20 15 Z" fill="var(--color-primary)" opacity="0.25" className="swirling-petal-1" />
          <path d="M75 25 Q80 30 75 35 Q70 30 75 25 Z" fill="var(--color-primary)" opacity="0.2" className="swirling-petal-2" />
        </svg>
      )}

      {theme === 'shinrin' && (
        <svg viewBox="0 0 100 100" className="scenery-svg">
          {/* Silhouette bamboo lines */}
          <rect x="15" y="0" width="2" height="100" fill="var(--color-primary)" opacity="0.12" />
          <rect x="25" y="0" width="3" height="100" fill="var(--color-primary)" opacity="0.08" />
          <rect x="80" y="0" width="2" height="100" fill="var(--color-primary)" opacity="0.1" />
          {/* Bamboo joints */}
          <line x1="14" y1="35" x2="18" y2="36" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.12" />
          <line x1="79" y1="65" x2="83" y2="66" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.1" />
        </svg>
      )}

      {theme === 'tasogare' && (
        <svg viewBox="0 0 100 100" className="scenery-svg">
          {/* Sun disk */}
          <circle cx="50" cy="50" r="16" fill="var(--color-primary)" opacity="0.15" />
          {/* Silhouette Mountain range */}
          <path d="M 0 80 Q 25 65 50 78 T 100 70 L 100 100 L 0 100 Z" fill="var(--color-text-muted)" opacity="0.12" />
        </svg>
      )}

      {theme === 'aizome' && (
        <svg viewBox="0 0 100 100" className="scenery-svg">
          {/* Crescent moon */}
          <path d="M 80 15 A 10 10 0 1 0 90 25 A 8 8 0 1 1 80 15 Z" fill="var(--color-secondary)" opacity="0.3" />
          {/* Star twinkle dots */}
          <circle cx="20" cy="20" r="1" fill="#FFFFFF" opacity="0.7" className="star-twinkle" />
          <circle cx="55" cy="12" r="1" fill="#FFFFFF" opacity="0.5" className="star-twinkle-delay" />
          {/* Small lantern hanging on the side */}
          <g className="lantern-group">
            <line x1="15" y1="0" x2="15" y2="25" stroke="var(--color-text-muted)" strokeWidth="1" />
            <rect x="10" y="25" width="10" height="14" rx="2" fill="var(--color-secondary)" opacity="0.8" className="lantern-body" />
            <rect x="12" y="23" width="6" height="2" fill="var(--color-text-main)" />
            <rect x="12" y="39" width="6" height="2" fill="var(--color-text-main)" />
          </g>
        </svg>
      )}
    </div>
  );
};
```

### 2. Environmental Styling & Keyframes (`src/components/EnvironmentalBackdrop.css`)
```css
.scenery-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1; /* Below the pet sprite */
}

.scenery-svg {
  width: 100%;
  height: 100%;
}

/* 1. Spring Sakura animations */
.swirling-petal-1 {
  animation: swirlOne 8s infinite linear;
  transform-origin: center;
}

@keyframes swirlOne {
  0% { transform: translateY(-10px) translateX(-5px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.35; }
  90% { opacity: 0.35; }
  100% { transform: translateY(60px) translateX(15px) rotate(360deg); opacity: 0; }
}

.swirling-petal-2 {
  animation: swirlTwo 10s infinite linear;
  transform-origin: center;
}

@keyframes swirlTwo {
  0% { transform: translateY(-10px) translateX(10px) rotate(0deg); opacity: 0; }
  15% { opacity: 0.25; }
  85% { opacity: 0.25; }
  100% { transform: translateY(50px) translateX(-20px) rotate(-180deg); opacity: 0; }
}

/* 2. Twinkling Stars (Indigo theme) */
.star-twinkle { animation: twinkle 3s infinite alternate; }
.star-twinkle-delay { animation: twinkle 4s infinite alternate 1.5s; }

@keyframes twinkle {
  0% { opacity: 0.2; }
  100% { opacity: 0.9; }
}

/* 3. Lantern Glow Flickering */
.lantern-body {
  animation: lanternFlicker 3s infinite ease-in-out;
  transform-origin: 15px 32px;
}

@keyframes lanternFlicker {
  0%, 100% {
    filter: drop-shadow(0 0 2px var(--color-secondary));
    opacity: 0.7;
    transform: rotate(-1deg);
  }
  50% {
    filter: drop-shadow(0 0 6px var(--color-secondary));
    opacity: 0.95;
    transform: rotate(1deg);
  }
}
```

## 🔍 Verification & Checklist
- [ ] Backdrop layer does not capture pointer events (`pointer-events: none` is set).
- [ ] Scenery SVG colors utilize CSS variables to coordinate with visual palettes.
- [ ] Swirling particles (sakura) trigger no layout shifting (overflow is locked on parent).
- [ ] Lantern flickering and swaying animations utilize hardware-accelerated attributes (`transform` & `opacity`).
