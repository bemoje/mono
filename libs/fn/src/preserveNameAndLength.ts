import type { Any } from '@mono/types'

/**
 * Preserves the name and length of a function or class constructor
 */
export function preserveNameAndLength<
  S extends ((...args: Any[]) => Any) | (new (...args: Any[]) => Any),
  F extends ((...args: Any[]) => Any) | (new (...args: Any[]) => Any),
>(source: S, target: F, adjustLengthBy = 0): F {
  return Object.defineProperties(target, {
    name: { configurable: true, value: source.name }, //
    length: { configurable: true, value: source.length + adjustLengthBy },
  })
}
