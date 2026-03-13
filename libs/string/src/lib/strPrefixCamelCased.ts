import { upperFirst } from 'es-toolkit/string'

/**
 * Prepend a camelCased string.
 *
 * Examples: @see strToGetterMethodName, @see strToSetterMethodName
 */
export function strPrefixCamelCased(str: string, prefix: string): string {
  return prefix + upperFirst(str)
}
