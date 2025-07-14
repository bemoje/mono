import { StringKeyOf } from '@mono/types'

/**
 * Same as Object.keys except the keys are typed as string keys of T.
 */
export function keysOf<T extends object>(obj: T) {
  return Object.keys(obj) as StringKeyOf<T>[]
}
