/**
 * Remove the time component from a date, returning only the date part.
 */
export function stripTime(date: Date): Date {
  return new Date(date.toISOString().slice(0, 10))
}
