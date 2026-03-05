/**
 * Determine whether the input is an array of numbers in ascending order.
 * Duplicate values are allowed.
 *
 * @example ```ts
 * isNumArrayAscending([1, 2]) //=> true
 * isNumArrayAscending([1, 1]) //=> true
 * isNumArrayAscending([1, 0]) //=> false : not ascending
 * ```
 */
export const isNumArrayAscending = (v: unknown) => {
  if (!Array.isArray(v)) {
    return false
  }
  for (const element of v) {
    if (typeof element !== 'number' || !Number.isFinite(element)) {
      return false
    }
  }
  for (let i = 1; i < v.length; i++) {
    if (v[i] < v[i - 1]) {
      return false
    }
  }
  return true
}
