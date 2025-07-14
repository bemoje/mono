import { addMonths } from 'date-fns/addMonths'
import { monthNameDa } from './monthNameDa'

/**
 * Get the (Danish) name of the month relative to the current month.
 *
 * @example ```ts
 * // assuming current month is August
 * monthNameDaRelative(-1) //=> 'Juli'
 * monthNameDaRelative(0) //=> 'August'
 * monthNameDaRelative(1) //=> 'September'
 * ```
 */
export function monthNameDaRelative(n: number) {
  return monthNameDa(addMonths(new Date(), n).getUTCMonth() + 1)
}
