/**
 * Calculates the number of milliseconds that have elapsed since the given date.
 */
export function msSinceDate(date: Date | string | number): number {
  return Date.now() - new Date(date).getTime()
}
