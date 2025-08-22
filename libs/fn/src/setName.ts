import { defineValue } from '@mono/object'

/**
 * Set the name of a function.
 */
export function setName<T extends object>(name: string | { name: string }, target: T): T {
  return defineValue(target, 'name', typeof name === 'string' ? name : name.name, { enumerable: false })
}
