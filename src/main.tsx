import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './styles/global.css'
import './styles/calendar.css'
import './styles/layout.css'
import './styles/stats.css'
import './styles/print.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
