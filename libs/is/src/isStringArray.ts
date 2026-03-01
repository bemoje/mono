import { isString } from 'es-toolkit/predicate'

/**
 * Determine whether the input is a string array.
 */
export function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value)
    && value.every((v) => {
      return isString(v)
    })
  )
}
