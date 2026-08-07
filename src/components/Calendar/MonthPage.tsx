import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ActivityDef, AppSettings, DayEntry } from '../../types'
import { formatMonthTitle, getMonthDays, dateKey } from '../../utils/date'
import { PAPER_RATIOS } from '../../utils/paper'
import { resolveLabel } from '../../i18n'
import { hexToRgba } from '../../utils/color'
import { computeWeightGridLines } from '../../utils/weightScale'
import type { FitSize } from '../../hooks/useFitCalendarSize'
import { DayActivitiesCell, DayHeaderCell, DayWeightInputCell } from './DayColumn'
import { WeightChart } from './WeightChart'

interface MonthPageProps {
  monthKey: string
  settings: AppSettings
  activities: ActivityDef[]
  entries: Record<string, DayEntry>
  interactive: boolean
  forExport?: boolean
  fitSize?: FitSize | null
}

const CHART_ROW = 3
const INPUT_ROW = 4

export function MonthPage({ monthKey, settings, activities, entries, interactive, forExport, fitSize }: MonthPageProps) {
  const { t } = useTranslation()
  const days = getMonthDays(monthKey)
  const weights = days.map((d) => entries[dateKey(d)]?.weight ?? null)
  const ratio = PAPER_RATIOS[settings.paperSize]
  const gridLines = useMemo(() => computeWeightGridLines(settings.weightRange), [settings.weightRange])

  const pageStyle = forExport
    ? undefined
    : fitSize
      ? { width: fitSize.width, height: fitSize.height }
      : { aspectRatio: ratio }

  return (
    <div className="calendar-page glass" data-month={monthKey} style={pageStyle}>
      <div className="calendar-page-header">
        <h2 className="calendar-title">{formatMonthTitle(monthKey, settings.locale)}</h2>
        <div className="calendar-legend">
          {activities.map((a) => (
            <span key={a.id} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: hexToRgba(a.color, 0.25) }}>
                {a.icon}
              </span>
              {resolveLabel(t, a.name)}
            </span>
          ))}
        </div>
      </div>

      <div
        className="calendar-grid"
        style={{
          gridTemplateColumns: `34px repeat(${days.length}, minmax(28px, 1fr))`,
          gridTemplateRows: 'auto minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 0.4fr)',
        }}
      >
        <div className="weight-axis" style={{ gridColumn: 1, gridRow: CHART_ROW }}>
          {gridLines.map((g, i) => (
            <span key={g.value} className="axis-tick" style={{ top: `${g.percent}%` }}>
              {i === gridLines.length - 1 ? `${g.value} ${settings.weightUnit}` : g.value}
            </span>
          ))}
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
