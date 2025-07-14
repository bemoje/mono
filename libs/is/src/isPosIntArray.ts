import { IsArrayWhereEach } from './IsArrayWhereEach'
import { isPositiveInteger } from './isPositiveInteger'

/**
 * Determine whether the input is a positive (including zero) integer array.
 *
 * @example ```ts
 * isPosIntArray([1, 2]) //=> true
 * isPosIntArray([1, 0]) //=> true
 * isPosIntArray([1, -1]) //=> false
 * ```
 */
export const isPosIntArray = IsArrayWhereEach([isPositiveInteger])
