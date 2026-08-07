import { HashRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Layout/Header'
import { HomePage } from './pages/HomePage'
import { DocsPage } from './pages/DocsPage'
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
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
