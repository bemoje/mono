import { strWrapInAngleBrackets } from './strWrapInAngleBrackets'
import { describe, expect, it } from 'vitest'

describe('strWrapInAngleBrackets', () => {
  it('example', () => {
    expect(strWrapInAngleBrackets('input')).toBe('<input>')
  })

  it('should wrap a string in angle brackets', () => {
    expect(strWrapInAngleBrackets('test')).toBe('<test>')
  })

  it('should return empty angle brackets for an empty string', () => {
    expect(strWrapInAngleBrackets('')).toBe('<>')
  })

  it('should handle strings with spaces', () => {
    expect(strWrapInAngleBrackets('test string')).toBe('<test string>')
  })

  it('should handle strings with special characters', () => {
    expect(strWrapInAngleBrackets('test@string')).toBe('<test@string>')
  })

  it('should handle strings with numbers', () => {
    expect(strWrapInAngleBrackets('test123')).toBe('<test123>')
  })
})
