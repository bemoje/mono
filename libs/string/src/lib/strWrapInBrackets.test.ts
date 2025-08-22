import { strWrapInBrackets } from './strWrapInBrackets'
import { describe, expect, it } from 'vitest'

describe('strWrapInBrackets', () => {
  it('example', () => {
    expect(strWrapInBrackets('input')).toBe('[input]')
  })

  it('should wrap a string in brackets', () => {
    expect(strWrapInBrackets('test')).toBe('[test]')
  })

  it('should return empty brackets for an empty string', () => {
    expect(strWrapInBrackets('')).toBe('[]')
  })

  it('should handle strings with special characters', () => {
    expect(strWrapInBrackets('!@#$%^&*()')).toBe('[!@#$%^&*()]')
  })

  it('should handle strings with spaces', () => {
    expect(strWrapInBrackets('hello world')).toBe('[hello world]')
  })

  it('should handle strings with numbers', () => {
    expect(strWrapInBrackets('12345')).toBe('[12345]')
  })
})
