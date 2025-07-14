import { strWrapInParenthesis } from './strWrapInParenthesis'
import { describe, expect, it } from 'vitest'

describe('strWrapInParenthesis', () => {
  it('example', () => {
    expect(strWrapInParenthesis('input')).toBe('(input)')
  })

  it('should wrap a string in parenthesis', () => {
    expect(strWrapInParenthesis('test')).toBe('(test)')
  })

  it('should return empty parenthesis for an empty string', () => {
    expect(strWrapInParenthesis('')).toBe('()')
  })

  it('should handle strings with special characters', () => {
    expect(strWrapInParenthesis('!@#$%^&*()')).toBe('(!@#$%^&*())')
  })

  it('should handle strings with spaces', () => {
    expect(strWrapInParenthesis('hello world')).toBe('(hello world)')
  })

  it('should handle strings with numbers', () => {
    expect(strWrapInParenthesis('12345')).toBe('(12345)')
  })
})
