import './App.css'
import { ThemeSelector } from './components/ThemeSelector'

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

        <div className="pet-display-section">
          <div className="pet-placeholder">🐾</div>
        </div>

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
