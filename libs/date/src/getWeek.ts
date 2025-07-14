import { getWeek as getWeekFns } from 'date-fns/getWeek'
import { da } from 'date-fns/locale/da'

/**
 * Get the week number of the year for a given date using Danish locale.
 */
export function getWeek(date: Date): number {
  return getWeekFns(date, { locale: da })
}
