import './App.css'
import { ThemeSelector } from './components/ThemeSelector'
import { PetDisplayWrapper } from './components/PetDisplayWrapper'

export default function App() {
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

        <PetDisplayWrapper baseMood="idle" />

        <section className="stats-dashboard">
          <div className="dashboard-placeholder">ステータス (Vitals Engine Pending)</div>
        </section>

        <footer className="care-controls-dock">
          <div className="dock-placeholder">お世話 (Care Dock Pending)</div>
        </footer>
      </main>
    </div>
  )
}
