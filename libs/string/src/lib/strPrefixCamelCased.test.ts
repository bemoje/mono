import { describe, expect, it } from 'vitest'
import { strPrefixCamelCased } from './strPrefixCamelCased'

describe(strPrefixCamelCased.name, () => {
  it('should prepend prefix and capitalize first char', () => {
    expect(strPrefixCamelCased('name', 'get')).toBe('getName')
    expect(strPrefixCamelCased('value', 'set')).toBe('setValue')
    expect(strPrefixCamelCased('active', 'is')).toBe('isActive')
  })
})
