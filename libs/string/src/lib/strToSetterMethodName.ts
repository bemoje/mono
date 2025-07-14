import { strPrefixCamelCased } from './strPrefixCamelCased'

/**
 * Prepend a camelCased string with 'set'.
 */
export function strToSetterMethodName(str: string): string {
  return strPrefixCamelCased(str, 'set')
}
