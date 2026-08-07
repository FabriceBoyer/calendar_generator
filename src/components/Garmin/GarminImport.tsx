import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import { parseGarminCsv } from '../../utils/garminImport'
import { readFileAsText } from '../../utils/download'
import type { GarminImportResult } from '../../utils/garminImport'

export function GarminImport() {
  const { t } = useTranslation()
  const activities = useAppStore((s) => s.activities)
  const toggleDayActivity = useAppStore((s) => s.toggleDayActivity)
  const setDayActivityValue = useAppStore((s) => s.setDayActivityValue)
  const entries = useAppStore((s) => s.entries)
  const [result, setResult] = useState<GarminImportResult | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await readFileAsText(file)
    const parsed = parseGarminCsv(text, activities)
    setResult(parsed)

    for (const item of parsed.parsed) {
      if (!item.matchedActivityId) continue
      const already = entries[item.date]?.activities.some((a) => a.activityId === item.matchedActivityId)
      if (!already) toggleDayActivity(item.date, item.matchedActivityId)
      const activity = activities.find((a) => a.id === item.matchedActivityId)
      if (!activity) continue
      const durationField = activity.fields.find((f) => f.type === 'duration')
      const distanceField = activity.fields.find((f) => f.type === 'distance')
      if (durationField && item.durationMin !== null) {
        setDayActivityValue(item.date, item.matchedActivityId, durationField.id, item.durationMin.toFixed(0))
      }
      if (distanceField && item.distanceKm !== null) {
        setDayActivityValue(item.date, item.matchedActivityId, distanceField.id, item.distanceKm.toFixed(1))
      }
    }
    e.target.value = ''
  }

  return (
    <div className="garmin-import">
      <p className="hint-text">{t('garmin.instructions')}</p>
      <label className="btn btn-primary file-btn">
        📂 {t('garmin.selectFile')}
        <input type="file" accept=".csv,text/csv" hidden onChange={handleFile} />
      </label>

      {result && (
        <div className="garmin-result">
          <p className="result-ok">✅ {t('garmin.matched', { count: result.matchedCount })}</p>
          {result.unmatchedCount > 0 && (
            <p className="result-warn">⚠️ {t('garmin.noMatch', { count: result.unmatchedCount })}</p>
          )}
        </div>
      )}
    </div>
  )
}
