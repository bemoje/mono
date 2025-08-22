/**
 * Determine whether the input is an array of numbers in ascending order.
 * Duplicate values are not allowed.
 *
 * @example ```ts
 * isUniqueNumArrayAscending([1, 2]) //=> true
 * isUniqueNumArrayAscending([1, 1]) //=> false : duplicate value
 * isUniqueNumArrayAscending([1, 0]) //=> false : not ascending
 * ```
 */
export const isUniqueNumArrayAscending = (v: unknown) => {
  if (!Array.isArray(v)) return false
  for (let i = 0; i < v.length; i++) {
    if (typeof v[i] !== 'number' || !Number.isFinite(v[i])) return false
  }
  for (let i = 1; i < v.length; i++) {
    if (v[i] <= v[i - 1]) return false
  }
  return true
}
