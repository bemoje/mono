import { IsLength } from './IsLength'

/**
 * Determine whether the input has length of 2.
 *
 * @example ```ts
 * isLen2('12') //=> true
 * isLen2([1, 2]) //=> true
 * isLen2('1') //=> false
 * isLen2([1]) //=> false
 * ```
 */
export const isLen2 = IsLength(2)
