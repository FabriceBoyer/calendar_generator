import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type {
  ActivityDef,
  AppSettings,
  DayEntry,
  Locale,
  PaperSize,
  ThemeMode,
  WeightRange,
} from '../types'
import { defaultActivities } from '../utils/defaultActivities'
import { detectLocale, detectPaperSize } from '../utils/locale'

function todayMonthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

interface AppStore {
  settings: AppSettings
  activities: ActivityDef[]
  entries: Record<string, DayEntry>
  currentMonth: string

  setLocale: (locale: Locale) => void
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setAccentColor: (color: string) => void
  setBackgroundImage: (url: string | null) => void
  setPaperSize: (size: PaperSize) => void
  setWeightRange: (range: WeightRange) => void
  setWeightUnit: (unit: 'kg' | 'lb') => void
  setOnlineMode: (enabled: boolean) => void

  addActivity: (activity: Omit<ActivityDef, 'id'>) => void
  updateActivity: (id: string, patch: Partial<ActivityDef>) => void
  deleteActivity: (id: string) => void
  reorderActivities: (activities: ActivityDef[]) => void

  setCurrentMonth: (month: string) => void

  getEntry: (date: string) => DayEntry
  setDayWeight: (date: string, weight: number | null) => void
  setDayNote: (date: string, note: string) => void
  toggleDayActivity: (date: string, activityId: string) => void
  setDayActivityValue: (date: string, activityId: string, fieldId: string, value: string) => void

  exportJson: () => string
  importJson: (json: string) => boolean
  resetAll: () => void
}

const defaultSettings: AppSettings = {
  locale: detectLocale(),
  theme: 'dark',
  accentColor: '#8b5cf6',
  backgroundImage: null,
  paperSize: detectPaperSize(),
  weightRange: { min: 90, max: 110 },
  weightUnit: 'kg',
  onlineMode: true,
}

function emptyEntry(date: string): DayEntry {
  return { date, activities: [], weight: null, note: '' }
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      activities: defaultActivities,
      entries: {},
      currentMonth: todayMonthKey(),

      setLocale: (locale) => set((s) => ({ settings: { ...s.settings, locale } })),
      setTheme: (theme) => set((s) => ({ settings: { ...s.settings, theme } })),
      toggleTheme: () =>
        set((s) => ({
          settings: { ...s.settings, theme: s.settings.theme === 'dark' ? 'light' : 'dark' },
        })),
      setAccentColor: (accentColor) => set((s) => ({ settings: { ...s.settings, accentColor } })),
      setBackgroundImage: (backgroundImage) =>
        set((s) => ({ settings: { ...s.settings, backgroundImage } })),
      setPaperSize: (paperSize) => set((s) => ({ settings: { ...s.settings, paperSize } })),
      setWeightRange: (weightRange) => set((s) => ({ settings: { ...s.settings, weightRange } })),
      setWeightUnit: (weightUnit) => set((s) => ({ settings: { ...s.settings, weightUnit } })),
      setOnlineMode: (onlineMode) => set((s) => ({ settings: { ...s.settings, onlineMode } })),

      addActivity: (activity) =>
        set((s) => ({ activities: [...s.activities, { ...activity, id: uuidv4() }] })),
      updateActivity: (id, patch) =>
        set((s) => ({
          activities: s.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      deleteActivity: (id) =>
        set((s) => ({
          activities: s.activities.filter((a) => a.id !== id),
          entries: Object.fromEntries(
            Object.entries(s.entries).map(([date, entry]) => [
              date,
              { ...entry, activities: entry.activities.filter((a) => a.activityId !== id) },
            ]),
          ),
        })),
      reorderActivities: (activities) => set({ activities }),

      setCurrentMonth: (currentMonth) => set({ currentMonth }),

      getEntry: (date) => get().entries[date] ?? emptyEntry(date),

      setDayWeight: (date, weight) =>
        set((s) => ({
          entries: {
            ...s.entries,
            [date]: { ...(s.entries[date] ?? emptyEntry(date)), weight },
          },
        })),

      setDayNote: (date, note) =>
        set((s) => ({
          entries: {
            ...s.entries,
            [date]: { ...(s.entries[date] ?? emptyEntry(date)), note },
          },
        })),

      toggleDayActivity: (date, activityId) =>
        set((s) => {
          const entry = s.entries[date] ?? emptyEntry(date)
          const exists = entry.activities.some((a) => a.activityId === activityId)
          const activities = exists
            ? entry.activities.filter((a) => a.activityId !== activityId)
            : [...entry.activities, { activityId, values: {} }]
          return { entries: { ...s.entries, [date]: { ...entry, activities } } }
        }),

      setDayActivityValue: (date, activityId, fieldId, value) =>
        set((s) => {
          const entry = s.entries[date] ?? emptyEntry(date)
          let found = false
          const activities = entry.activities.map((a) => {
            if (a.activityId === activityId) {
              found = true
              return { ...a, values: { ...a.values, [fieldId]: value } }
            }
            return a
          })
          if (!found) {
            activities.push({ activityId, values: { [fieldId]: value } })
          }
          return { entries: { ...s.entries, [date]: { ...entry, activities } } }
        }),

      exportJson: () => {
        const s = get()
        return JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            settings: s.settings,
            activities: s.activities,
            entries: s.entries,
          },
          null,
          2,
        )
      },

      importJson: (json) => {
        try {
          const data = JSON.parse(json)
          if (!data || typeof data !== 'object') return false
          set((s) => ({
            settings: data.settings ? { ...s.settings, ...data.settings } : s.settings,
            activities: Array.isArray(data.activities) ? data.activities : s.activities,
            entries: data.entries && typeof data.entries === 'object' ? data.entries : s.entries,
          }))
          return true
        } catch {
          return false
        }
      },

      resetAll: () =>
        set({
          settings: defaultSettings,
          activities: defaultActivities,
          entries: {},
          currentMonth: todayMonthKey(),
        }),
    }),
    {
      name: 'calfit-storage',
      version: 1,
    },
  ),
)
