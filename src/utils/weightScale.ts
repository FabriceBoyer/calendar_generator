import type { WeightRange } from '../types'

export interface WeightGridLine {
  value: number
  /** 0 = top (max), 100 = bottom (min) */
  percent: number
}

function niceStep(rawStep: number): number {
  const mag = 10 ** Math.floor(Math.log10(rawStep))
  const norm = rawStep / mag
  let niceNorm: number
  if (norm <= 1) niceNorm = 1
  else if (norm <= 2) niceNorm = 2
  else if (norm <= 5) niceNorm = 5
  else niceNorm = 10
  return niceNorm * mag
}

export function computeWeightGridLines(range: WeightRange, targetCount = 10): WeightGridLine[] {
  const span = range.max - range.min
  if (!(span > 0)) return [{ value: range.min, percent: 100 }]

  const step = niceStep(span / targetCount)
  const lines: WeightGridLine[] = []
  const start = Math.ceil(range.min / step) * step

  for (let v = start; v <= range.max + 1e-9; v += step) {
    const value = Math.round(v * 100) / 100
    const percent = 100 - ((value - range.min) / span) * 100
    lines.push({ value, percent })
  }

  if (lines.length === 0 || Math.abs(lines[0].value - range.min) > 1e-6) {
    lines.unshift({ value: range.min, percent: 100 })
  }
  if (Math.abs(lines[lines.length - 1].value - range.max) > 1e-6) {
    lines.push({ value: range.max, percent: 0 })
  }
  return lines
}
