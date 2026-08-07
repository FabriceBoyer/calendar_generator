export type FieldType = 'duration' | 'distance' | 'number' | 'text'

export interface ActivityField {
  id: string
  /** i18n key or free label */
  label: string
  type: FieldType
  unit?: string
}

export interface ActivityDef {
  id: string
  name: string
  icon: string
  color: string
  fields: ActivityField[]
  builtin?: boolean
}

export interface ActivityEntryValue {
  activityId: string
  values: Record<string, string>
}

export interface DayEntry {
  /** ISO date string yyyy-MM-dd */
  date: string
  activities: ActivityEntryValue[]
  weight: number | null
  note?: string
}

export type PaperSize = 'A4' | 'Letter' | 'A3' | 'Legal'
export type ThemeMode = 'light' | 'dark'
export type Locale = 'fr' | 'en'

export interface WeightRange {
  min: number
  max: number
}

export interface AppSettings {
  locale: Locale
  theme: ThemeMode
  accentColor: string
  backgroundImage: string | null
  paperSize: PaperSize
  weightRange: WeightRange
  weightUnit: 'kg' | 'lb'
  onlineMode: boolean
}

export interface AppState {
  settings: AppSettings
  activities: ActivityDef[]
  entries: Record<string, DayEntry>
  currentMonth: string
}
