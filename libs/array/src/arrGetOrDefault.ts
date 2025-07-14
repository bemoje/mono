import { hasOwnProperty } from '@mono/object'

/**
 * Get array element at index or create it using factory function if it doesn't exist.
 */
export function arrGetOrDefault<V>(array: V[], index: number, factory: (index: number) => V): V {
  const value = array[index]
  if (value !== undefined || hasOwnProperty(array, index)) return value
  return (array[index] = factory(index))
}
