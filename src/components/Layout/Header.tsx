import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import i18n from '../../i18n'
import type { Locale } from '../../types'

export function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const theme = useAppStore((s) => s.settings.theme)
  const locale = useAppStore((s) => s.settings.locale)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const setLocale = useAppStore((s) => s.setLocale)

  const changeLocale = (l: Locale) => {
    setLocale(l)
    void i18n.changeLanguage(l)
  }

  return (
    <header className="app-header no-print glass">
      <div className="app-header-brand">
        <span className="app-logo">📅</span>
        <div>
          <h1 className="app-title">{t('app.title')}</h1>
          <span className="app-subtitle">{t('app.subtitle')}</span>
        </div>
      </div>

      <nav className="app-nav">
        <Link to="/" className={`nav-link${location.pathname === '/' ? ' active' : ''}`} title={t('header.home')}>
          📅 <span className="btn-label">{t('header.home')}</span>
        </Link>
        <Link to="/stats" className={`nav-link${location.pathname === '/stats' ? ' active' : ''}`} title={t('header.stats')}>
          📊 <span className="btn-label">{t('header.stats')}</span>
        </Link>
        <Link to="/docs" className={`nav-link${location.pathname === '/docs' ? ' active' : ''}`} title={t('header.docs')}>
          📖 <span className="btn-label">{t('header.docs')}</span>
        </Link>
      </nav>

      <div className="app-header-actions">
        <div className="locale-switch" role="group" aria-label={t('header.language')}>
          <button
            className={`locale-btn${locale === 'fr' ? ' active' : ''}`}
            onClick={() => changeLocale('fr')}
            type="button"
          >
            FR
          </button>
          <button
            className={`locale-btn${locale === 'en' ? ' active' : ''}`}
            onClick={() => changeLocale('en')}
            type="button"
          >
            EN
          </button>
        </div>
        <button className="btn btn-icon" onClick={toggleTheme} title={t('header.theme')} type="button">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
