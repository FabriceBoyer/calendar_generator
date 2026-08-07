import { useTranslation } from 'react-i18next'
import type { ActivityDef, DayEntry, Locale } from '../../types'
import { isWeekend, weekdayShort } from '../../utils/date'
import { resolveLabel } from '../../i18n'
import { useAppStore } from '../../store/useAppStore'

interface DayColumnProps {
  date: Date
  dateStr: string
  col: number
  entry: DayEntry
  activities: ActivityDef[]
  locale: Locale
  interactive: boolean
  weightRow: number
  inputRow: number
}

export function DayHeaderCell({ date, col, locale }: Pick<DayColumnProps, 'date' | 'col' | 'locale'>) {
  const weekend = isWeekend(date)
  return (
    <div
      className={`day-header-cell${weekend ? ' weekend' : ''}`}
      style={{ gridColumn: col, gridRow: 1 }}
    >
      <span className="day-number">{date.getDate()}</span>
      <span className="day-weekday">{weekdayShort(date, locale)}</span>
    </div>
  )
}

export function DayActivitiesCell({ dateStr, col, entry, activities, interactive }: DayColumnProps) {
  const { t } = useTranslation()
  const toggleDayActivity = useAppStore((s) => s.toggleDayActivity)
  const setDayActivityValue = useAppStore((s) => s.setDayActivityValue)

  return (
    <div className="day-activities-cell" style={{ gridColumn: col, gridRow: 2 }}>
      {activities.map((activity) => {
        const active = entry.activities.some((a) => a.activityId === activity.id)
        const entryValue = entry.activities.find((a) => a.activityId === activity.id)
        return (
          <div key={activity.id} className={`activity-row${active ? ' active' : ''}`}>
            <button
              type="button"
              className="activity-toggle"
              title={resolveLabel(t, activity.name)}
              disabled={!interactive}
              style={{
                borderColor: activity.color,
                background: active ? activity.color : 'transparent',
              }}
              onClick={() => interactive && toggleDayActivity(dateStr, activity.id)}
            >
              <span>{activity.icon}</span>
            </button>
            {active && interactive && (
              <div className="activity-fields">
                {activity.fields.map((field) => (
                  <input
                    key={field.id}
                    className="activity-field-input"
                    type="text"
                    inputMode="decimal"
                    placeholder={field.unit || resolveLabel(t, field.label)}
                    value={entryValue?.values[field.id] ?? ''}
                    onChange={(e) => setDayActivityValue(dateStr, activity.id, field.id, e.target.value)}
                  />
                ))}
              </div>
            )}
            {active && !interactive && <div className="activity-blank-line" />}
          </div>
        )
      })}
    </div>
  )
}

export function DayWeightInputCell({ dateStr, col, entry, interactive, inputRow }: DayColumnProps) {
  const setDayWeight = useAppStore((s) => s.setDayWeight)
  return (
    <div className="day-weight-cell" style={{ gridColumn: col, gridRow: inputRow }}>
      {interactive ? (
        <input
          type="number"
          className="weight-input"
          step="0.1"
          value={entry.weight ?? ''}
          onChange={(e) => setDayWeight(dateStr, e.target.value === '' ? null : Number(e.target.value))}
        />
      ) : (
        <div className="weight-blank-line" />
      )}
    </div>
  )
}
