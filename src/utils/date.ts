import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfMonth,
} from 'date-fns'
import { fr, enUS } from 'date-fns/locale'
import type { Locale } from '../types'

export function dateFnsLocale(locale: Locale) {
  return locale === 'fr' ? fr : enUS
}

export function monthKeyToDate(monthKey: string): Date {
  return parse(monthKey, 'yyyy-MM', new Date())
}

export function dateToMonthKey(date: Date): string {
  return format(date, 'yyyy-MM')
}

export function shiftMonth(monthKey: string, delta: number): string {
  return dateToMonthKey(addMonths(monthKeyToDate(monthKey), delta))
}

export function getMonthDays(monthKey: string): Date[] {
  const start = startOfMonth(monthKeyToDate(monthKey))
  const end = endOfMonth(start)
  return eachDayOfInterval({ start, end })
}

export function dateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatMonthTitle(monthKey: string, locale: Locale): string {
  const d = monthKeyToDate(monthKey)
  const label = format(d, 'MMMM yyyy', { locale: dateFnsLocale(locale) })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function weekdayShort(date: Date, locale: Locale): string {
  const label = format(date, 'EEE', { locale: dateFnsLocale(locale) })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}
