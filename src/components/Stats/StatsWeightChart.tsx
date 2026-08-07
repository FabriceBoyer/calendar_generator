import { useMemo } from 'react'
import type { WeightRange } from '../../types'
import type { WeightPoint } from '../../utils/stats'
import { computeWeightGridLines } from '../../utils/weightScale'

interface StatsWeightChartProps {
  points: WeightPoint[]
  range: WeightRange
  weightUnit: string
}

export function StatsWeightChart({ points, range, weightUnit }: StatsWeightChartProps) {
  const displayRange = useMemo<WeightRange>(() => {
    if (points.length === 0) return range
    const values = points.map((p) => p.weight)
    const dataMin = Math.min(...values)
    const dataMax = Math.max(...values)
    const padding = Math.max(1, (dataMax - dataMin) * 0.1)
    return {
      min: Math.min(range.min, Math.floor(dataMin - padding)),
      max: Math.max(range.max, Math.ceil(dataMax + padding)),
    }
  }, [points, range])

  const gridLines = useMemo(() => computeWeightGridLines(displayRange, 6), [displayRange])

  const chartPoints = useMemo(() => {
    const span = displayRange.max - displayRange.min || 1
    const n = points.length
    return points.map((p, i) => ({
      x: n > 1 ? (i / (n - 1)) * 100 : 50,
      y: 100 - ((p.weight - displayRange.min) / span) * 100,
      date: p.date,
      weight: p.weight,
    }))
  }, [points, displayRange])

  const path = useMemo(() => {
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  }, [chartPoints])

  if (points.length === 0) return null

  const firstDate = points[0]?.date
  const lastDate = points[points.length - 1]?.date

  return (
    <div className="stats-weight-chart">
      <div className="stats-chart-axis">
        {gridLines.map((g, i) => (
          <span key={g.value} className="stats-axis-tick" style={{ top: `${g.percent}%` }}>
            {i === gridLines.length - 1 ? `${g.value} ${weightUnit}` : g.value}
          </span>
        ))}
      </div>
      <div className="stats-chart-plot">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="stats-chart-svg">
          {gridLines.map((g) => (
            <line
              key={g.value}
              x1={0}
              y1={g.percent}
              x2={100}
              y2={g.percent}
              className="chart-gridline"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {path && (
            <path
              d={path}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.4}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {chartPoints.map((p) => (
            <circle key={p.date} cx={p.x} cy={p.y} r={1.3} fill="var(--accent)" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="stats-chart-dates">
          <span>{firstDate}</span>
          {lastDate !== firstDate && <span>{lastDate}</span>}
        </div>
      </div>
    </div>
  )
}
