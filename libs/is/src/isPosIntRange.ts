import { isLen2 } from './isLen2'
import { isNumArrayAscending } from './isNumArrayAscending'
import { isPosIntArray } from './isPosIntArray'

/**
 * Checks if the input is an array of exactly two positive integers in ascending order, representing a valid range.
 */
export const isPosIntRange = (v: unknown) => isNumArrayAscending(v) && isLen2(v) && isPosIntArray(v)
