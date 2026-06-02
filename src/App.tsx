import './App.css'
import { ThemeSelector } from './components/ThemeSelector'
import { useTheme } from './context/ThemeContext'

function App() {
  const { theme } = useTheme();

  return (
    <div className="container washi-card">
      <div className="app-header">
        <h1 className="jp-title">お留守番ペット 🐾</h1>
        <p className="jp-subtitle">Desk Pet Companion</p>
      </div>

      <div className="content-body">
        <div className="pet-placeholder">
          <span className="pet-icon">🦊</span>
          <p className="placeholder-text">Theme: {theme}</p>
        </div>
      </div>

      <div className="selector-section">
        <ThemeSelector />
      </div>
    </div>
  )
}

export default App
