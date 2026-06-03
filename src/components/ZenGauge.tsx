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
