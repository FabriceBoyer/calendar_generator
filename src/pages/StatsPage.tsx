import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { computeStats } from '../utils/stats'
import { StatsWeightChart } from '../components/Stats/StatsWeightChart'
import { ActivityBreakdown } from '../components/Stats/ActivityBreakdown'

export function StatsPage() {
  const { t } = useTranslation()
  const entries = useAppStore((s) => s.entries)
  const activities = useAppStore((s) => s.activities)
  const settings = useAppStore((s) => s.settings)

  const stats = useMemo(() => computeStats(entries), [entries])
  const hasData = stats.totalDaysTracked > 0

  return (
    <div className="scroll-area">
      <div className="stats-page">
        <div className="stats-header glass">
          <h2>{t('stats.title')}</h2>
          <p>{t('stats.subtitle')}</p>
        </div>

        {!hasData && (
          <div className="stats-empty glass">
            <span className="stats-empty-icon">📊</span>
            <p>{t('stats.noData')}</p>
          </div>
        )}

        {hasData && (
          <>
            <div className="stats-cards">
              <div className="stat-card glass">
                <span className="stat-value">{stats.totalDaysTracked}</span>
                <span className="stat-label">{t('stats.daysTracked')}</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-value">{stats.totalActivityLogs}</span>
                <span className="stat-label">{t('stats.activitiesLogged')}</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-value">
                  {stats.weightLast !== null ? `${stats.weightLast} ${settings.weightUnit}` : '—'}
                </span>
                <span className="stat-label">{t('stats.currentWeight')}</span>
              </div>
              <div className="stat-card glass">
                <span
                  className={`stat-value${
                    stats.weightDelta !== null ? (stats.weightDelta > 0 ? ' negative' : stats.weightDelta < 0 ? ' positive' : '') : ''
                  }`}
                >
                  {stats.weightDelta !== null
                    ? `${stats.weightDelta > 0 ? '+' : ''}${stats.weightDelta.toFixed(1)} ${settings.weightUnit}`
                    : '—'}
                </span>
                <span className="stat-label">{t('stats.weightChange')}</span>
                {stats.weightDelta !== null && <span className="stat-sublabel">{t('stats.since')}</span>}
              </div>
            </div>

            <div className="stats-section glass">
              <h3>{t('stats.weightEvolution')}</h3>
              {stats.weightPoints.length > 0 ? (
                <>
                  <StatsWeightChart points={stats.weightPoints} range={settings.weightRange} weightUnit={settings.weightUnit} />
                  <div className="stats-weight-summary">
                    <span>
                      {t('stats.min')}: <strong>{stats.weightMin} {settings.weightUnit}</strong>
                    </span>
                    <span>
                      {t('stats.avg')}: <strong>{stats.weightAvg?.toFixed(1)} {settings.weightUnit}</strong>
                    </span>
                    <span>
                      {t('stats.max')}: <strong>{stats.weightMax} {settings.weightUnit}</strong>
                    </span>
                  </div>
                </>
              ) : (
                <p className="stats-no-data-inline">{t('stats.noWeightData')}</p>
              )}
            </div>

            <div className="stats-section glass">
              <h3>{t('stats.byActivity')}</h3>
              {stats.activityCounts.length > 0 ? (
                <ActivityBreakdown stats={stats.activityCounts} activities={activities} />
              ) : (
                <p className="stats-no-data-inline">{t('stats.noActivityData')}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
