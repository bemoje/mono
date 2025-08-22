import { IgnoreValuesOptions } from '../types'

/**
 * Default filter functions for ignoring values during object inspection.
 */
export const ignoreValuesFilterDefaults: Record<keyof IgnoreValuesOptions, (value: unknown) => boolean> = {
  noFalse: (value: unknown) => value !== false,
  noNull: (value: unknown) => value !== null,
  noUndefined: (value: unknown) => value !== undefined,
  noEmptyArray: (value: unknown) => !Array.isArray(value) || !!value.length,
  noEmptyObject: (value: unknown) =>
    !value || typeof value !== 'object' || Array.isArray(value) || !!Object.keys(value!).length,
}
