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
        <button className="btn month-label" onClick={() => setCurrentMonth(thisMonthKey)} type="button">
          {formatMonthTitle(currentMonth, locale)}
        </button>
        <button className="btn btn-icon" onClick={() => setCurrentMonth(shiftMonth(currentMonth, 1))} title={t('header.nextMonth')} type="button">
          ▶
        </button>
      </div>

      <div className="toolbar-actions">
        {onlineMode && <span className="badge">✏️ {t('settings.onlineMode')}</span>}
        <button className="btn" onClick={onOpenGarmin} type="button">
          ⌚ {t('header.garmin')}
        </button>
        <button className="btn" onClick={onOpenExport} type="button">
          ⬇ {t('header.export')}
        </button>
        <button className="btn btn-primary" onClick={onOpenSettings} type="button">
          ⚙ {t('header.settings')}
        </button>
      </div>
    </div>
  )
}
