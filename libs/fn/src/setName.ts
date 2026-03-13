/**
 * Set the name of a function.
 */
export function setName<T extends object>(name: string | { name: string }, target: T): T {
  return Object.defineProperty(target, 'name', {
    value: typeof name === 'string' ? name : name.name,
    configurable: true,
    enumerable: false,
  })
}
