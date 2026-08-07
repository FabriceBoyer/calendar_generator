import { HashRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Layout/Header'
import { HomePage } from './pages/HomePage'
import { DocsPage } from './pages/DocsPage'
import { StatsPage } from './pages/StatsPage'
import { useThemeSync } from './hooks/useThemeSync'
import { usePrintPageSize } from './hooks/usePrintPageSize'

function App() {
  useThemeSync()
  usePrintPageSize()

  return (
    <HashRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
