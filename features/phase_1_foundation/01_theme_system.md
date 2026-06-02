# Feature 1.1: Fonts & Core Theme Variable Definition

This document outlines the detailed implementation of the global theme system based on traditional Japanese palettes.

---

## 📋 Requirements
- Set up global fonts from Google Fonts for high-quality, refined typography.
- Implement CSS custom properties (variables) for the four thematic palettes.
- Create a React context and custom hook (`useTheme`) to manage the state and persistence of the user's active theme.
- Avoid flash-of-unstyled-content (FOUC) on load.

## 🎨 Aesthetic Specifications
- **Typography**: 
  - Main Japanese Title & UI accents: `"Noto Serif JP"`, serif (evokes calligraphy and elegance).
  - Body & Reading texts: `"Inter"`, sans-serif (clean, highly readable).
  - Code/Numbers: `"Outfit"`, sans-serif (refined geometric, feels premium).
- **Contrast**: Soft blacks (e.g., Sumi Charcoal `#2C2C2A` instead of solid `#000000`) and soft off-whites/creams (`#FAF8F5`) to prevent eye strain.

## 💻 Code Structure

### 1. Typography Integration (`index.html`)
Add the following Google Fonts reference inside the `<head>` of [index.html](file:///home/timbla/code/vite-project/index.html):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Serif+JP:wght@500;700&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
```

### 2. State & Persistence Context (`src/context/ThemeContext.tsx`)
Create a custom context to manage theme selection.

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'spring-garden' | 'aizome' | 'tasogare' | 'shinrin';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (localStorage.getItem('desk-pet-theme') as ThemeType) || 'spring-garden';
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('desk-pet-theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### 3. Theme Select Component (`src/components/ThemeSelector.tsx`)
A minimal theme-switching dropdown or dock using Japanese calligraphy titles.

```tsx
import React from 'react';
import { useTheme, ThemeType } from '../context/ThemeContext';

const themes: { value: ThemeType; label: string }[] = [
  { value: 'spring-garden', label: '春庭 (Sakura)' },
  { value: 'aizome', label: '藍染 (Indigo)' },
  { value: 'tasogare', label: '黄昏 (Twilight)' },
  { value: 'shinrin', label: '森林 (Bamboo)' },
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-selector" style={{ display: 'flex', gap: '8px' }}>
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`theme-btn ${theme === t.value ? 'active' : ''}`}
          aria-label={`Switch theme to ${t.label}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};
```

## 🔍 Verification & Checklist
- [ ] Theme variables transition immediately upon selecting a theme.
- [ ] Active theme persists in `localStorage` across page reloads.
- [ ] Font classes apply Noto Serif JP correctly to headers and Inter to body copy.
- [ ] Soft text shadows are used sparingly to prevent legibility issues.
