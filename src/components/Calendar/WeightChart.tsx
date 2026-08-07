import { useMemo } from 'react'
import type { WeightRange } from '../../types'

interface WeightChartProps {
  weights: (number | null)[]
  range: WeightRange
  gridRow: number
  color?: string
}

export function WeightChart({ weights, range, gridRow, color = 'var(--accent)' }: WeightChartProps) {
  const n = weights.length
  const points = useMemo(() => {
    const span = range.max - range.min || 1
    return weights.map((w, i) => {
      const x = ((i + 0.5) / n) * 100
      if (w === null || Number.isNaN(w)) return null
      const clamped = Math.min(range.max, Math.max(range.min, w))
      const y = 100 - ((clamped - range.min) / span) * 100
      return { x, y, valid: w >= range.min && w <= range.max }
    })
  }, [weights, range, n])

  const path = useMemo(() => {
    let d = ''
    points.forEach((p) => {
      if (!p) return
      d += d === '' ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`
    })
    return d
  }, [points])

  const gridLines = [0, 25, 50, 75, 100]

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="weight-chart-overlay"
      style={{ gridRow, gridColumn: '1 / -1' }}
    >
      {gridLines.map((g) => (
        <line key={g} x1={0} y1={g} x2={100} y2={g} className="chart-gridline" vectorEffect="non-scaling-stroke" />
      ))}
      {Array.from({ length: n + 1 }).map((_, i) => (
        <line
          key={i}
          x1={(i / n) * 100}
          y1={0}
          x2={(i / n) * 100}
          y2={100}
          className="chart-colline"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {path && (
        <path d={path} fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {points.map(
        (p, i) =>
          p && (
            <circle key={i} cx={p.x} cy={p.y} r={1.6} fill={color} vectorEffect="non-scaling-stroke" />
          ),
      )}
    </svg>
  )
}
