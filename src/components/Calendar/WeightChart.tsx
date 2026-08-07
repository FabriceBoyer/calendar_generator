import { useMemo } from 'react'
import type { WeightRange } from '../../types'
import { computeWeightGridLines } from '../../utils/weightScale'

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
      return { x, y, weight: w }
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

  const gridLines = useMemo(() => computeWeightGridLines(range), [range])

  const lastPoint = useMemo(() => {
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i]
      if (p) return p
    }
    return null
  }, [points])

  return (
    <div className="weight-chart-wrap" style={{ gridRow, gridColumn: '1 / -1' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="weight-chart-overlay">
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
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chart-line"
          />
        )}
      </svg>
      {/* Rendered as real (non-distorted) HTML circles: the SVG above is
          stretched non-uniformly to fill a very wide, short box, which
          would otherwise squash <circle> shapes into thin ellipses. */}
      <div className="weight-chart-points">
        {points.map(
          (p, i) =>
            p && (
              <span
                key={i}
                className={`weight-point${p === lastPoint ? ' current' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, background: color }}
                title={`${p.weight}`}
              />
            ),
        )}
        {lastPoint && (
          <span
            className={`weight-point-label${lastPoint.y < 50 ? ' below' : ' above'}`}
            style={{
              left: `${lastPoint.x}%`,
              top: `${lastPoint.y}%`,
              borderColor: color,
              color,
            }}
          >
            {lastPoint.weight}
          </span>
        )}
      </div>
    </div>
  )
}
