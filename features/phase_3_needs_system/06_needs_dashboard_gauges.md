# Feature 3.2: Zen Needs Dashboard Gauges (Bamboo Indicators)

This document describes the design and visual assembly of the stats gauge indicators tracking the pet's Hunger and Energy values.

---

## 📋 Requirements
- Render percentage bars for Hunger and Energy.
- Avoid loud or gamified standard progress bars. Use minimalist gauges that match the Japanese ink wash/woodblock printing aesthetic.
- Display numbers and labels cleanly with clear text-based values.

## 🎨 Aesthetic Specifications
- **Bamboo Gauge Frame**: Instead of container borders with sharp fills, design progress tracks styled like thin, clean bamboo stalks (`height: 6px`, very light background, rounded ends).
- **Ink Wash Fill**: The filled bar should resemble smooth, textured paint/ink strokes with slight transitions.
- **Labels**: Use dual English-Japanese labels (e.g. `元気 (Energy)` and `空腹 (Hunger)`) in Noto Serif JP font to enrich the cultural feel.

## 💻 Code Structure

### 1. Gauge Component (`src/components/ZenGauge.tsx`)
A reusable gauge component rendering custom tracks:

```tsx
import React from 'react';
import './ZenGauge.css';

interface ZenGaugeProps {
  labelJp: string;
  labelEn: string;
  value: number; // 0 to 100
  colorVar: string; // CSS variable name for color, e.g. '--color-primary'
  invertFill?: boolean; // If true, 0 is full and 100 is empty (useful if tracking Hunger)
}

export const ZenGauge: React.FC<ZenGaugeProps> = ({
  labelJp,
  labelEn,
  value,
  colorVar,
  invertFill = false,
}) => {
  // Determine fill percentage
  const fillPercentage = invertFill ? 100 - value : value;

  return (
    <div className="zen-gauge-container">
      <div className="zen-gauge-header">
        <span className="gauge-label-jp">{labelJp}</span>
        <span className="gauge-label-en">{labelEn}</span>
        <span className="gauge-value">{Math.round(value)}%</span>
      </div>
      <div className="zen-gauge-track">
        <div
          className="zen-gauge-fill"
          style={{
            width: `${fillPercentage}%`,
            backgroundColor: `var(${colorVar})`,
          }}
        />
      </div>
    </div>
  );
};
```

### 2. Dashboard Component (`src/components/VitalsDashboard.tsx`)
Binds multiple gauges inside a layout.

```tsx
import React from 'react';
import { useVitals } from '../context/VitalsContext';
import { ZenGauge } from './ZenGauge';
import './VitalsDashboard.css';

export const VitalsDashboard: React.FC = () => {
  const { hunger, energy } = useVitals();

  return (
    <div className="vitals-dashboard">
      {/* Energy Gauge */}
      <ZenGauge
        labelJp="元気"
        labelEn="Energy"
        value={energy}
        colorVar="--color-primary"
      />

      {/* Hunger Gauge (Hunger increases, so 100% hunger means empty stomach. Invert fills for visuals) */}
      <ZenGauge
        labelJp="空腹"
        labelEn="Hunger"
        value={hunger}
        colorVar="--color-secondary"
        invertFill={true} // High hunger value shows less filled/satisfied bar
      />
    </div>
  );
};
```

### 3. Styled Gauge Layouts (`src/components/ZenGauge.css` & `src/components/VitalsDashboard.css`)
```css
/* ZenGauge.css */
.zen-gauge-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.zen-gauge-header {
  display: flex;
  align-items: baseline;
  font-size: 0.85rem;
}

.gauge-label-jp {
  font-family: 'Noto Serif JP', serif;
  font-weight: 700;
  margin-right: 6px;
  color: var(--color-text-main);
}

.gauge-label-en {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-grow: 1;
}

.gauge-value {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  color: var(--color-text-main);
}

/* Bamboo shoot style progress bar */
.zen-gauge-track {
  height: 6px;
  background-color: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.zen-gauge-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1); /* Soft fluid transition */
}

/* VitalsDashboard.css */
.vitals-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
}
```

## 🔍 Verification & Checklist
- [ ] Gauge fills slide smoothly and do not jump abruptly when states update.
- [ ] Gauge labels render correct Japanese translation text.
- [ ] Percentage numerical font displays in the geometric Outfit style.
- [ ] Clear distinction is visible between empty/full values (especially for inverted Hunger parameters).
