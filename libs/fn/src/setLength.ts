/**
 * Set the length of a function.
 */
export function setLength<T extends object>(length: number | { length: number }, target: T): T {
  return Object.defineProperty(target, 'length', {
    value: typeof length === 'number' ? length : length.length,
    enumerable: false,
    configurable: true,
  })
}
