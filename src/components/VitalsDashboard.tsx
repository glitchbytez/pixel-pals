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
