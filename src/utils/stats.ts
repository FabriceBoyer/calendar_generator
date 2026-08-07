import type { DayEntry } from '../types'

export interface ActivityStat {
  activityId: string
  count: number
}

export interface WeightPoint {
  date: string
  weight: number
}

export interface StatsSummary {
  totalDaysTracked: number
  totalActivityLogs: number
  activityCounts: ActivityStat[]
  weightPoints: WeightPoint[]
  weightMin: number | null
  weightMax: number | null
  weightAvg: number | null
  weightFirst: number | null
  weightLast: number | null
  weightDelta: number | null
}

export function computeStats(entries: Record<string, DayEntry>): StatsSummary {
  const dates = Object.keys(entries).sort()

  let totalActivityLogs = 0
  let totalDaysTracked = 0
  const countMap: Record<string, number> = {}
  const weightPoints: WeightPoint[] = []

  for (const date of dates) {
    const entry = entries[date]
    const hasActivity = entry.activities.length > 0
    const hasWeight = entry.weight !== null && entry.weight !== undefined
    if (hasActivity || hasWeight) totalDaysTracked++

    for (const a of entry.activities) {
      countMap[a.activityId] = (countMap[a.activityId] ?? 0) + 1
      totalActivityLogs++
    }
    if (hasWeight) weightPoints.push({ date, weight: entry.weight as number })
  }

  const activityCounts = Object.entries(countMap)
    .map(([activityId, count]) => ({ activityId, count }))
    .sort((a, b) => b.count - a.count)

  const weights = weightPoints.map((w) => w.weight)
  const weightMin = weights.length ? Math.min(...weights) : null
  const weightMax = weights.length ? Math.max(...weights) : null
  const weightAvg = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : null
  const weightFirst = weightPoints.length ? weightPoints[0].weight : null
  const weightLast = weightPoints.length ? weightPoints[weightPoints.length - 1].weight : null
  const weightDelta = weightFirst !== null && weightLast !== null ? weightLast - weightFirst : null

  return {
    totalDaysTracked,
    totalActivityLogs,
    activityCounts,
    weightPoints,
    weightMin,
    weightMax,
    weightAvg,
    weightFirst,
    weightLast,
    weightDelta,
  }
}
