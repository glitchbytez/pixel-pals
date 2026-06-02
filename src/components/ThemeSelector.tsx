import React from 'react';
import { useTheme, type ThemeType } from '../context/ThemeContext';
import './ThemeSelector.css';

const themes: { value: ThemeType; label: string }[] = [
  { value: 'spring-garden', label: '春庭' },
  { value: 'aizome', label: '藍染' },
  { value: 'tasogare', label: '黄昏' },
  { value: 'shinrin', label: '森林' },
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-selector">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`theme-btn ${theme === t.value ? 'active' : ''}`}
          aria-label={`Switch theme to ${t.label}`}
        >
          <span className="theme-btn-dot" />
          <span className="theme-btn-text">{t.label}</span>
        </button>
      ))}
    </div>
  );
};
