import { IgnoreValuesOptions } from '../types'

/**
 * Default filter functions for ignoring values during object inspection.
 */
export const ignoreValuesFilterDefaults: Record<keyof IgnoreValuesOptions, (value: unknown) => boolean> = {
  noFalse: (value: unknown) => {
    return value !== false
  },
  noNull: (value: unknown) => {
    return value !== null
  },
  noUndefined: (value: unknown) => {
    return value !== undefined
  },
  noEmptyArray: (value: unknown) => {
    return !Array.isArray(value) || !!value.length
  },
  noEmptyObject: (value: unknown) => {
    return !value || typeof value !== 'object' || Array.isArray(value) || !!Object.keys(value!).length
  },
}
