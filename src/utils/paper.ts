import type { PaperSize } from '../types'

export const PAPER_RATIOS: Record<PaperSize, number> = {
  A4: 297 / 210,
  Letter: 11 / 8.5,
  A3: 420 / 297,
  Legal: 14 / 8.5,
}

export const PAPER_CSS_SIZE: Record<PaperSize, string> = {
  A4: 'a4',
  Letter: 'letter',
  A3: 'a3',
  Legal: 'legal',
}

// Millimeters, landscape (width x height)
export const PAPER_MM: Record<PaperSize, { width: number; height: number }> = {
  A4: { width: 297, height: 210 },
  Letter: { width: 279.4, height: 215.9 },
  A3: { width: 420, height: 297 },
  Legal: { width: 355.6, height: 215.9 },
}
