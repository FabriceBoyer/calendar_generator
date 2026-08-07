import { useTranslation } from 'react-i18next'
import type { ActivityDef } from '../../types'
import type { ActivityStat } from '../../utils/stats'
import { resolveLabel } from '../../i18n'

interface ActivityBreakdownProps {
  stats: ActivityStat[]
  activities: ActivityDef[]
}

export function ActivityBreakdown({ stats, activities }: ActivityBreakdownProps) {
  const { t } = useTranslation()
  const maxCount = Math.max(1, ...stats.map((s) => s.count))

  return (
    <div className="activity-breakdown">
      {stats.map((stat) => {
        const activity = activities.find((a) => a.id === stat.activityId)
        if (!activity) return null
        return (
          <div key={stat.activityId} className="breakdown-row">
            <span className="breakdown-icon">{activity.icon}</span>
            <span className="breakdown-name">{resolveLabel(t, activity.name)}</span>
            <div className="breakdown-bar-track">
              <div
                className="breakdown-bar-fill"
                style={{ width: `${(stat.count / maxCount) * 100}%`, background: activity.color }}
              />
            </div>
            <span className="breakdown-count">
              {stat.count} {t('stats.entries')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
