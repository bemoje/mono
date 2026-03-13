import { da } from 'date-fns/locale'
import { getWeek as getWeekFns } from 'date-fns'

/**
 * Get the week number of the year for a given date using Danish locale.
 */
export function getWeek(date: Date): number {
  return getWeekFns(date, { locale: da })
}
