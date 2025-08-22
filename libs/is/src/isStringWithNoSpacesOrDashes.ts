import { isString } from 'lodash-es'

/**
 * Checks if the provided value is a string that contains no spaces or dashes.
 */
export function isStringWithNoSpacesOrDashes(value: unknown) {
  return isString(value) && /^[^\s-]+$/i.test(value)
}
