import { useTranslation } from 'react-i18next'
import type { ActivityDef, AppSettings, DayEntry } from '../../types'
import { formatMonthTitle, getMonthDays, dateKey } from '../../utils/date'
import { PAPER_RATIOS } from '../../utils/paper'
import { resolveLabel } from '../../i18n'
import { DayActivitiesCell, DayHeaderCell, DayWeightInputCell } from './DayColumn'
import { WeightChart } from './WeightChart'

interface MonthPageProps {
  monthKey: string
  settings: AppSettings
  activities: ActivityDef[]
  entries: Record<string, DayEntry>
  interactive: boolean
  forExport?: boolean
}

const CHART_ROW = 3
const INPUT_ROW = 4

export function MonthPage({ monthKey, settings, activities, entries, interactive, forExport }: MonthPageProps) {
  const { t } = useTranslation()
  const days = getMonthDays(monthKey)
  const weights = days.map((d) => entries[dateKey(d)]?.weight ?? null)
  const ratio = PAPER_RATIOS[settings.paperSize]

  return (
    <div
      className="calendar-page glass"
      data-month={monthKey}
      style={forExport ? undefined : { aspectRatio: ratio }}
    >
      <div className="calendar-page-header">
        <h2 className="calendar-title">{formatMonthTitle(monthKey, settings.locale)}</h2>
        <div className="calendar-legend">
          {activities.map((a) => (
            <span key={a.id} className="legend-item" style={{ '--legend-color': a.color } as React.CSSProperties}>
              <span className="legend-dot">{a.icon}</span>
              {resolveLabel(t, a.name)}
            </span>
          ))}
        </div>
      </div>

      <div
        className="calendar-grid"
        style={{
          gridTemplateColumns: `34px repeat(${days.length}, 1fr)`,
          gridTemplateRows: 'auto 1fr 96px 34px',
        }}
      >
        <div className="weight-axis" style={{ gridColumn: 1, gridRow: CHART_ROW }}>
          <span className="axis-label axis-max">{settings.weightRange.max}</span>
          <span className="axis-unit">{settings.weightUnit}</span>
          <span className="axis-label axis-min">{settings.weightRange.min}</span>
        </div>

        {days.map((d, i) => (
          <DayHeaderCell key={dateKey(d)} date={d} col={i + 2} locale={settings.locale} />
        ))}

        {days.map((d, i) => {
          const ds = dateKey(d)
          return (
            <DayActivitiesCell
              key={ds}
              date={d}
              dateStr={ds}
              col={i + 2}
              entry={entries[ds] ?? { date: ds, activities: [], weight: null }}
              activities={activities}
              locale={settings.locale}
              interactive={interactive}
              weightRow={CHART_ROW}
              inputRow={INPUT_ROW}
            />
          )
        })}

        <WeightChart weights={weights} range={settings.weightRange} gridRow={CHART_ROW} />

        {days.map((d, i) => {
          const ds = dateKey(d)
          return (
            <DayWeightInputCell
              key={ds}
              date={d}
              dateStr={ds}
              col={i + 2}
              entry={entries[ds] ?? { date: ds, activities: [], weight: null }}
              activities={activities}
              locale={settings.locale}
              interactive={interactive}
              weightRow={CHART_ROW}
              inputRow={INPUT_ROW}
            />
          )
        })}
      </div>
      <div className="calendar-footer-label">{t('calendar.weight')}</div>
    </div>
  )
}
