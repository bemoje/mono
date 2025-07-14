import { isLen2 } from './isLen2'

/**
 * Determine whether the input is an array of two integers in ascending order.
 *
 * @example ```ts
 * isIntRange([1, 2]) //=> true
 * isIntRange([1, 1]) //=> true
 * isIntRange([-1, 0]) //=> true
 * isIntRange([2, 1]) //=> false : not ascending
 * isIntRange([1, 2, 3]) //=> false : length not 2
 * isIntRange([1]) //=> false : length not 2
 * ```
 */
export const isIntRange = (v: unknown): boolean => {
  if (!Array.isArray(v) || !isLen2(v)) return false

  // Check if both elements are integers
  const [first, second] = v
  if (!Number.isInteger(first) || !Number.isInteger(second)) return false

  // Check if in ascending order (equal values allowed)
  return first <= second
}
