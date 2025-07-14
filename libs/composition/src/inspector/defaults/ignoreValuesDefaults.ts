import { IgnoreValuesOptions } from '../types'

/**
 * Default options for ignoring specific values during object inspection.
 */
export const ignoreValuesDefaults: IgnoreValuesOptions = {
  noEmptyArray: true,
  noEmptyObject: true,
  noNull: true,
  noUndefined: true,
  noFalse: false,
}
