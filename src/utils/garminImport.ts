import type { ActivityDef } from '../types'

export interface ParsedGarminActivity {
  date: string // yyyy-MM-dd
  rawType: string
  durationMin: number | null
  distanceKm: number | null
  matchedActivityId: string | null
}

export interface GarminImportResult {
  parsed: ParsedGarminActivity[]
  matchedCount: number
  unmatchedCount: number
}

const TYPE_KEYWORDS: Record<string, string[]> = {
  walk: ['walk', 'marche', 'hiking', 'randonn'],
  run: ['run', 'course', 'jog'],
  bike: ['cycl', 'bik', 'vélo', 'velo', 'mountain'],
  swim: ['swim', 'natation', 'piscine', 'pool'],
  pilates: ['pilates', 'yoga'],
  plank: ['strength', 'core', 'gainage'],
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      result.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur)
  return result
}

function parseDuration(raw: string): number | null {
  if (!raw) return null
  const parts = raw.split(':').map((p) => Number.parseFloat(p))
  if (parts.some((p) => Number.isNaN(p))) return null
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60
  if (parts.length === 2) return parts[0] + parts[1] / 60
  return Number.parseFloat(raw) || null
}

function parseDate(raw: string): string | null {
  const match = raw.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (match) return `${match[1]}-${match[2]}-${match[3]}`
  const alt = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (alt) return `${alt[3]}-${alt[1].padStart(2, '0')}-${alt[2].padStart(2, '0')}`
  return null
}

function matchActivity(rawType: string, activities: ActivityDef[]): string | null {
  const lower = rawType.toLowerCase()
  for (const [builtinId, keywords] of Object.entries(TYPE_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      const match = activities.find((a) => a.id === builtinId || a.name.toLowerCase().includes(builtinId))
      if (match) return match.id
    }
  }
  return null
}

export function parseGarminCsv(csvText: string, activities: ActivityDef[]): GarminImportResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) return { parsed: [], matchedCount: 0, unmatchedCount: 0 }

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  const typeIdx = header.findIndex((h) => h.includes('activity type') || h === 'type')
  const dateIdx = header.findIndex((h) => h.includes('date'))
  const distanceIdx = header.findIndex((h) => h.includes('distance'))
  const timeIdx = header.findIndex((h) => h === 'time' || h.includes('moving time') || h.includes('duration'))

  const parsed: ParsedGarminActivity[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const rawType = typeIdx >= 0 ? cols[typeIdx] ?? '' : ''
    const rawDate = dateIdx >= 0 ? cols[dateIdx] ?? '' : ''
    const date = parseDate(rawDate)
    if (!date) continue
    const distanceKm = distanceIdx >= 0 ? Number.parseFloat(cols[distanceIdx]) || null : null
    const durationMin = timeIdx >= 0 ? parseDuration(cols[timeIdx]) : null
    const matchedActivityId = matchActivity(rawType, activities)
    parsed.push({ date, rawType, durationMin, distanceKm, matchedActivityId })
  }

  const matchedCount = parsed.filter((p) => p.matchedActivityId).length
  return { parsed, matchedCount, unmatchedCount: parsed.length - matchedCount }
}
