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
  if (!Array.isArray(v)) {
    return false
  }
  for (const element of v) {
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      return false
    }
  }
  for (let i = 1; i < v.length; i++) {
    if (v[i] <= v[i - 1]) {
      return false
    }
  }
  return true
}
