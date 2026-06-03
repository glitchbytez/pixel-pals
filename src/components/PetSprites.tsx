import React from 'react';

export type MoodType = 'idle' | 'happy' | 'hungry' | 'tired' | 'sleeping' | 'eating';

interface SpriteProps {
  mood: MoodType;
}

export const PetSprite: React.FC<SpriteProps> = ({ mood }) => {
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
          {/* Tail wagging */}
          <path d="M 60 65 Q 85 55 75 75 Z" fill="var(--color-primary)" className="tail-wag" />
        </svg>
      );

    case 'hungry':
      return (
        <svg viewBox="0 0 100 100" className="pet-svg hungry-state">
          {/* Fox Body */}
          <path d="M30 70 L70 70 L60 42 L40 42 Z" fill="var(--color-primary-light)" />
          {/* Drooped Ears */}
          <polygon points="30,42 22,25 38,38" fill="var(--color-primary)" />
          <polygon points="70,42 78,25 62,38" fill="var(--color-primary)" />
          {/* Sad/droopy Eyes */}
          <circle cx="43" cy="48" r="2.5" fill="var(--color-text-main)" />
          <circle cx="57" cy="48" r="2.5" fill="var(--color-text-main)" />
          {/* Sweat drop (representing concern) */}
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
          {/* Ears slightly forward */}
          <polygon points="32,50 25,35 40,47" fill="var(--color-primary)" />
          <polygon points="68,50 75,35 60,47" fill="var(--color-primary)" />
          {/* Sleepy half-closed eyes */}
          <line x1="38" y1="52" x2="46" y2="52" stroke="var(--color-text-main)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="54" y1="52" x2="62" y2="52" stroke="var(--color-text-main)" strokeWidth="2.5" strokeLinecap="round" />
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
          <path d="M 37 62 Q 41 65 45 62" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 55 62 Q 59 65 63 62" stroke="var(--color-text-muted)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'eating':
      return (
        <svg viewBox="0 0 100 100" className="pet-svg eating-state">
          {/* Body */}
          <path d="M30 70 L70 70 L60 40 L40 40 Z" fill="var(--color-primary-light)" />
          {/* Ears */}
          <polygon points="30,40 25,20 40,35" fill="var(--color-primary)" />
          <polygon points="70,40 75,20 60,35" fill="var(--color-primary)" />
          {/* Cheerful happy eyes */}
          <path d="M 38 45 Q 43 41 48 45" stroke="var(--color-text-main)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 52 45 Q 57 41 62 45" stroke="var(--color-text-main)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Blush */}
          <circle cx="34" cy="50" r="4" fill="var(--color-primary)" opacity="0.6" />
          <circle cx="66" cy="50" r="4" fill="var(--color-primary)" opacity="0.6" />
          {/* Small Onigiri 🍙 (chewing animation) */}
          <polygon points="45,55 55,55 50,46" fill="#FFFFFF" stroke="var(--color-text-main)" strokeWidth="1.5" />
          <rect x="48" y="52" width="4" height="3" fill="#2C2C2A" />
        </svg>
      );

    default: // 'idle' state
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
          {/* Gentle Smile */}
          <path d="M 48 51 Q 50 53 52 51" stroke="var(--color-text-main)" strokeWidth="2" fill="none" />
          {/* Soft tail */}
          <path d="M 60 65 Q 80 50 72 70 Z" fill="var(--color-primary)" className="tail-sway" />
        </svg>
      );
  }
};
