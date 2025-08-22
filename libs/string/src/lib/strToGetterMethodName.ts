import { strPrefixCamelCased } from './strPrefixCamelCased'

/**
 * Prepend a camelCased string with 'get'.
 */
export function strToGetterMethodName(str: string): string {
  return strPrefixCamelCased(str, 'get')
}
