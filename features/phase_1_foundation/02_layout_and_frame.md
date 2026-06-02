# Feature 1.2: Core Layout & Washi Paper Glassmorphic Frame

This document details the layout structure, CSS styling, and visual treatments used to form the premium container for the digital desk pet.

---

## 📋 Requirements
- Build a responsive layout frame suitable for desktop overlays.
- Implement a glassmorphic container styled with subtle washi-paper-like textures.
- Introduce delicate, thin borders typical of minimalist Japanese craft boxes (Kiribako - 桐箱).
- Configure spacing units using the Japanese design concept of *Ma* (spacing/negative space).

## 🎨 Aesthetic Specifications
- **Ma-inspired Spacing**: Avoid crowding elements. Space sections exactly according to a strict grid hierarchy (e.g., standard gaps of `24px` or `32px` rather than dense padding).
- **Kiribako Borders**: Thin, low-contrast solid border lines (`1px solid var(--color-border)`) combined with double-layered subtle shadows instead of harsh dark drop-shadows.
- **Washi Paper Grid Texture**: A low-opacity noise SVG overlay (`opacity: 0.015 - 0.03`) layered on top of a frosted glass container (`backdrop-filter: blur(16px)`).

## 💻 Code Structure

### 1. Washi Texture Background Pattern
We will define an inline SVG background or CSS noise pattern for the card. The following CSS uses a repeating radial gradient to simulate paper texture, overlaying the active variables:

```css
/* Washi Paper texture effect */
.washi-container {
  position: relative;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 
    0 4px 20px -2px var(--color-shadow),
    0 2px 6px -1px var(--color-shadow);
  backdrop-filter: blur(16px);
  overflow: hidden;
}

/* Washi Paper grain pattern */
.washi-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.02;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

### 2. Main Page Layout (`src/App.tsx`)
Set up the viewport structure wrapping all sub-components:

```tsx
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeSelector } from './components/ThemeSelector';
import './App.css';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="app-viewport">
        {/* Decorative elements representing Japanese paper seals */}
        <div className="decorative-seal">
          <span>木漏れ日</span> {/* Komorebi - Sunlight filtering through trees */}
        </div>

        <main className="main-content washi-container">
          <header className="app-header">
            <h1 className="jp-title">お留守番ペット</h1> {/* Desktop Guardian Pet */}
            <ThemeSelector />
          </header>

          <div className="pet-display-section">
            {/* Phase 2: Pet Sprite goes here */}
            <div className="pet-placeholder">🐾</div>
          </div>

          <section className="stats-dashboard">
            {/* Phase 3: Stats go here */}
          </section>

          <footer className="care-controls-dock">
            {/* Phase 4: Buttons go here */}
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
};
```

### 3. Grid Settings (`src/App.css`)
Ensure layout styles align with *Ma* guidelines:

```css
.app-viewport {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-bg-base);
  transition: background-color 0.4s ease;
  font-family: 'Inter', sans-serif;
  color: var(--color-text-main);
  padding: 40px;
}

.main-content {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 32px; /* Large gap representing "Ma" space */
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 16px;
}

.jp-title {
  font-family: 'Noto Serif JP', serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.1em;
}

.decorative-seal {
  position: absolute;
  top: 24px;
  left: 24px;
  font-family: 'Noto Serif JP', serif;
  font-size: 0.75rem;
  writing-mode: vertical-rl; /* Traditional Japanese vertical reading layout */
  text-orientation: upright;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  opacity: 0.6;
}
```

## 🔍 Verification & Checklist
- [ ] Viewport transitions color smoothly when Switching themes.
- [ ] Grain background overlay acts only visually and does not capture clicks (`pointer-events: none`).
- [ ] Mobile viewports center card properly and constrain padding safely.
- [ ] Layout spacing respects empty space (*Ma*), ensuring elements do not feel cluttered.
