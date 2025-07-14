/**
 * Returns the name, in Danish language, of the month corresponding to the provided month number.
 *
 * @param month - A month number between 1 and 12.
 *
 * @throws if the provided month number is not a valid month.
 *
 * @example ```ts
 * monthNameDA(9) //=> 'September'
 * ```
 */
export function monthNameDa(month: number): string {
  if (month < 1 || month > 12) {
    throw new Error('Invalid month number. Got: ' + month)
  }
  return MONTH_NAMES_DA[month]
}

const MONTH_NAMES_DA = [
  '',
  'Januar',
  'Februar',
  'Marts',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'December',
]
