# Feature 5.1: Real-Time Circadian Theme Switcher

This document details the background scheduling system that detects system time and automatically transitions the visual theme to match daylight stages.

---

## 📋 Requirements
- Build a React hook `useCircadian` that monitors system hours.
- Periodically check hours (e.g. every minute) to transition theme state dynamically.
- Implement an "Auto Mode" toggle so users can override or opt-in to circadian synchronization.
- Define hour ranges matching day cycles:
  - **Dawn (06:00 - 09:00)** -> `spring-garden` (Sakura)
  - **Day (09:00 - 17:00)** -> `shinrin` (Bamboo/Green)
  - **Twilight (17:00 - 20:00)** -> `tasogare` (Twilight/Warm)
  - **Night (20:00 - 06:00)** -> `aizome` (Indigo/Midnight)

## 🎨 Aesthetic Specifications
- **Theme Transitions**: Color changes must happen over smooth CSS transitions (`transition: all 0.8s ease-in-out` on colors and backdrops) to avoid flashing.
- **Ambient Indicators**: When Auto mode is enabled, display a small moon/sun indicator (🌞/🌙) near the theme selector using a minimalist calligraphy stamp.

## 💻 Code Structure

### 1. Custom Circadian Hook (`src/hooks/useCircadian.ts`)
```typescript
import { useEffect, useState } from 'react';
import { ThemeType } from '../context/ThemeContext';

export const useCircadian = (
  isAutoEnabled: boolean,
  setTheme: (theme: ThemeType) => void
) => {
  const [currentPeriod, setCurrentPeriod] = useState<string>('Day');

  useEffect(() => {
    if (!isAutoEnabled) return;

    const determineCircadianTheme = () => {
      const hours = new Date().getHours();
      let targetTheme: ThemeType = 'shinrin';
      let periodName = 'Day';

      if (hours >= 6 && hours < 9) {
        targetTheme = 'spring-garden'; // Dawn
        periodName = '明け方 (Dawn)';
      } else if (hours >= 9 && hours < 17) {
        targetTheme = 'shinrin';        // Midday
        periodName = '昼中 (Day)';
      } else if (hours >= 17 && hours < 20) {
        targetTheme = 'tasogare';       // Twilight
        periodName = '夕暮れ (Twilight)';
      } else {
        targetTheme = 'aizome';         // Night
        periodName = '夜更け (Night)';
      }

      setTheme(targetTheme);
      setCurrentPeriod(periodName);
    };

    // Run immediately on enable
    determineCircadianTheme();

    // Check time sync status every 60 seconds
    const interval = setInterval(determineCircadianTheme, 60000);

    return () => clearInterval(interval);
  }, [isAutoEnabled, setTheme]);

  return currentPeriod;
};
```

### 2. Auto-Circadian Toggle Control Component
Adding circadian checkbox features to the top header selector:

```tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCircadian } from '../hooks/useCircadian';

export const CircadianHeaderSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isAuto, setIsAuto] = useState<boolean>(() => {
    return localStorage.getItem('theme-circadian-auto') === 'true';
  });

  const periodName = useCircadian(isAuto, setTheme);

  useEffect(() => {
    localStorage.setItem('theme-circadian-auto', String(isAuto));
  }, [isAuto]);

  return (
    <div className="circadian-selector-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Auto circad toggle */}
        <label className="circadian-checkbox-label">
          <input
            type="checkbox"
            checked={isAuto}
            onChange={(e) => setIsAuto(e.target.checked)}
          />
          <span className="checkbox-custom-label">自動同期 (Time Sync)</span>
        </label>
        {isAuto && (
          <span className="circadian-period-badge" title="Active Day Period">
            {periodName}
          </span>
        )}
      </div>

      {!isAuto && (
        <div className="manual-theme-buttons">
          <button onClick={() => setTheme('spring-garden')} className={theme === 'spring-garden' ? 'active' : ''}>春</button>
          <button onClick={() => setTheme('shinrin')} className={theme === 'shinrin' ? 'active' : ''}>森</button>
          <button onClick={() => setTheme('tasogare')} className={theme === 'tasogare' ? 'active' : ''}>暮</button>
          <button onClick={() => setTheme('aizome')} className={theme === 'aizome' ? 'active' : ''}>藍</button>
        </div>
      )}
    </div>
  );
};
```

### 3. Styled Circadian Badge CSS Elements
```css
.circadian-checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  cursor: pointer;
}

.circadian-period-badge {
  font-family: 'Noto Serif JP', serif;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 4px;
  border: 1px solid var(--color-primary);
}

.manual-theme-buttons {
  display: flex;
  gap: 4px;
}

.manual-theme-buttons button {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: 'Noto Serif JP', serif;
  font-size: 0.75rem;
  cursor: pointer;
}

.manual-theme-buttons button.active {
  background-color: var(--color-primary);
  color: var(--color-bg-card);
  border-color: var(--color-primary);
}
```

## 🔍 Verification & Checklist
- [ ] Manual theme selection overrides are strictly blocked when Time Sync (自動同期) checkbox is active.
- [ ] Local storage holds the sync state so active sync is remembered between loads.
- [ ] Clock changes (tested by changing the local machine clock) prompt immediate, smooth theme changes.
- [ ] CSS transition parameters prevent color popping/flashing.
