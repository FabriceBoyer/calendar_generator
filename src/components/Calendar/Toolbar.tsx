import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import { formatMonthTitle, shiftMonth } from '../../utils/date'

interface ToolbarProps {
  onOpenSettings: () => void
  onOpenExport: () => void
  onOpenGarmin: () => void
}

export function Toolbar({ onOpenSettings, onOpenExport, onOpenGarmin }: ToolbarProps) {
  const { t } = useTranslation()
  const currentMonth = useAppStore((s) => s.currentMonth)
  const setCurrentMonth = useAppStore((s) => s.setCurrentMonth)
  const locale = useAppStore((s) => s.settings.locale)
  const onlineMode = useAppStore((s) => s.settings.onlineMode)

  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  return (
    <div className="toolbar no-print glass">
      <div className="toolbar-nav">
        <button className="btn btn-icon" onClick={() => setCurrentMonth(shiftMonth(currentMonth, -1))} title={t('header.prevMonth')} type="button">
          ◀
        </button>
        <span className="month-label">{formatMonthTitle(currentMonth, locale)}</span>
        <button className="btn btn-icon" onClick={() => setCurrentMonth(shiftMonth(currentMonth, 1))} title={t('header.nextMonth')} type="button">
          ▶
        </button>
        <button
          className="btn"
          onClick={() => setCurrentMonth(thisMonthKey)}
          disabled={currentMonth === thisMonthKey}
          title={t('header.today')}
          type="button"
        >
          🏠 <span className="btn-label">{t('header.today')}</span>
        </button>
      </div>

      <div className="toolbar-actions">
        {onlineMode && (
          <span className="badge">
            ✏️ <span className="btn-label">{t('settings.onlineMode')}</span>
          </span>
        )}
        <button className="btn" onClick={onOpenGarmin} title={t('header.garmin')} type="button">
          ⌚ <span className="btn-label">{t('header.garmin')}</span>
        </button>
        <button className="btn" onClick={onOpenExport} title={t('header.export')} type="button">
          ⬇ <span className="btn-label">{t('header.export')}</span>
        </button>
        <button className="btn btn-primary" onClick={onOpenSettings} title={t('header.settings')} type="button">
          ⚙ <span className="btn-label">{t('header.settings')}</span>
        </button>
      </div>
    </div>
  )
}
