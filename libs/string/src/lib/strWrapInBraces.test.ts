import { strWrapInBraces } from './strWrapInBraces'
import { describe, expect, it } from 'vitest'

describe('strWrapInBraces', () => {
  it('example', () => {
    expect(strWrapInBraces('input')).toBe('{input}')
  })

  it('should wrap a string in braces', () => {
    expect(strWrapInBraces('test')).toBe('{test}')
  })

  it('should return {} for an empty string', () => {
    expect(strWrapInBraces('')).toBe('{}')
  })

  it('should handle strings with special characters', () => {
    expect(strWrapInBraces('!@#$%^&*()')).toBe('{!@#$%^&*()}')
  })

  it('should handle strings with numbers', () => {
    expect(strWrapInBraces('1234567890')).toBe('{1234567890}')
  })

  it('should handle strings with spaces', () => {
    expect(strWrapInBraces('test string')).toBe('{test string}')
  })
})
