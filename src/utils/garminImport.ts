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
  swim: ['swim', 'natation', 'piscine', 'pool', 'nat.'],
  pilates: ['pilates', 'yoga'],
  plank: ['strength', 'core', 'gainage', 'musculation'],
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
  if (!raw || raw === '--') return null
  const parts = raw.split(':').map((p) => Number.parseFloat(p.replace(',', '.')))
  if (parts.some((p) => Number.isNaN(p))) return null
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60
  if (parts.length === 2) return parts[0] + parts[1] / 60
  return Number.parseFloat(raw) || null
}

/**
 * Garmin Connect's CSV export is inconsistent across locales and activity
 * types: cardio distances use a locale decimal separator (e.g. French
 * "15,05" = 15.05 km), pool swims are exported with a literal dot ("2.050"
 * = 2.05 km), and open-water swims are exported as bare meters ("957").
 * This normalizes all of that down to kilometers.
 */
function parseDistanceKm(raw: string, activityId: string | null): number | null {
  if (!raw || raw === '--') return null
  const trimmed = raw.trim()
  if (trimmed === '') return null

  if (trimmed.includes(',')) {
    // Locale decimal comma; strip any thousands-grouping dot first.
    const normalized = trimmed.replace(/\./g, '').replace(',', '.')
    const n = Number.parseFloat(normalized)
    return Number.isNaN(n) ? null : n
  }

  if (trimmed.includes('.')) {
    const n = Number.parseFloat(trimmed)
    return Number.isNaN(n) ? null : n
  }

  const n = Number.parseFloat(trimmed)
  if (Number.isNaN(n)) return null
  // A bare integer for a swim is almost always raw meters (open water).
  if (activityId === 'swim' && n > 50) return n / 1000
  return n
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
  // Column names vary by Garmin Connect export locale (e.g. "Activity Type"
  // vs "Type d'activité", "Time"/"Duration" vs "Durée"), so match loosely.
  const typeIdx = header.findIndex((h) => h.includes('type'))
  const dateIdx = header.findIndex((h) => h.includes('date'))
  const distanceIdx = header.findIndex((h) => h.includes('distance'))
  const timeIdx = header.findIndex(
    (h) => h.includes('durée') || h.includes('duration') || h === 'time' || h.includes('moving time'),
  )

  const parsed: ParsedGarminActivity[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const rawType = typeIdx >= 0 ? cols[typeIdx] ?? '' : ''
    const rawDate = dateIdx >= 0 ? cols[dateIdx] ?? '' : ''
    const date = parseDate(rawDate)
    if (!date) continue
    const matchedActivityId = matchActivity(rawType, activities)
    const distanceKm = distanceIdx >= 0 ? parseDistanceKm(cols[distanceIdx] ?? '', matchedActivityId) : null
    const durationMin = timeIdx >= 0 ? parseDuration(cols[timeIdx] ?? '') : null
    parsed.push({ date, rawType, durationMin, distanceKm, matchedActivityId })
  }

  const matchedCount = parsed.filter((p) => p.matchedActivityId).length
  return { parsed, matchedCount, unmatchedCount: parsed.length - matchedCount }
}
