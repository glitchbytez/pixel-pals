import './App.css'
import { ThemeSelector } from './components/ThemeSelector'
import { PetDisplayWrapper } from './components/PetDisplayWrapper'
import { useVitals } from './context/VitalsContext'
import { VitalsDashboard } from './components/VitalsDashboard'

export default function App() {
  const { baseMood } = useVitals()

  return (
    <div className="app-viewport">
      {/* Decorative vertical seal representing Japanese paper stamps */}
      <div className="decorative-seal">
        <span>木漏れ日</span>
      </div>

      <main className="main-content washi-container">
        <header className="app-header">
          <h1 className="jp-title">お留守番ペット</h1>
          <ThemeSelector />
        </header>

        <PetDisplayWrapper baseMood={baseMood} />

        <section className="stats-dashboard">
          <VitalsDashboard />
        </section>

        <footer className="care-controls-dock">
          <div className="dock-placeholder">お世話 (Care Dock Pending)</div>
        </footer>
      </main>
    </div>
  )
}
