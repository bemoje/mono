import { isHexOrUnicode } from './isHexOrUnicode'
import { describe, expect, it } from 'vitest'

describe('isHexOrUnicode', () => {
  it('should return true for hexadecimal strings', () => {
    expect(isHexOrUnicode('0x123abc')).toBe(true)
    expect(isHexOrUnicode('0XABCDEF')).toBe(true)
    expect(isHexOrUnicode('0x789')).toBe(true)
  })

  it('should return true for unicode strings', () => {
    expect(isHexOrUnicode('\\u1234')).toBe(true)
    expect(isHexOrUnicode('\\uabcd')).toBe(true)
    expect(isHexOrUnicode('\\u5678')).toBe(true)
  })

  it('should return true for hexadecimal strings without prefix', () => {
    expect(isHexOrUnicode('123abc')).toBe(true)
    expect(isHexOrUnicode('ABCDEF')).toBe(true)
    expect(isHexOrUnicode('789')).toBe(true)
  })

  it('should return false for non-hexadecimal and non-unicode strings', () => {
    expect(isHexOrUnicode('hello')).toBe(false)
    expect(isHexOrUnicode('123g')).toBe(false)
    expect(isHexOrUnicode('0x123g')).toBe(false)
    expect(isHexOrUnicode('\\uhello')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isHexOrUnicode('')).toBe(false)
  })

  it('should return false for strings with spaces', () => {
    expect(isHexOrUnicode('0x123 abc')).toBe(false)
    expect(isHexOrUnicode('\\u1234 abc')).toBe(false)
    expect(isHexOrUnicode('123 abc')).toBe(false)
  })
})
