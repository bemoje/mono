import { format } from 'date-fns/format'

/**
 * Reutnrs the date formatted as: yyyy-MM-dd
 */
export function dateString(date?: Date | number | string) {
  return format(date ? new Date(date) : new Date(), 'yyyy-MM-dd')
}
