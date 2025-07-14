import { isNumericString } from './isNumericString'
import { describe, expect, it } from 'vitest'

describe('isNumericString', () => {
  it('should return true for numeric strings', () => {
    expect(isNumericString('123')).toBe(true)
    expect(isNumericString('0')).toBe(true)
    expect(isNumericString('-123')).toBe(true)
    expect(isNumericString('0.123')).toBe(true)
    expect(isNumericString('1.23e+5')).toBe(true)
  })

  it('should return false for non-numeric strings', () => {
    expect(isNumericString('abc')).toBe(false)
    expect(isNumericString('123abc')).toBe(false)
    expect(isNumericString('')).toBe(false)
    expect(isNumericString(' ')).toBe(false)
    expect(isNumericString('NaN')).toBe(false)
    expect(isNumericString('Infinity')).toBe(false)
    expect(isNumericString('-Infinity')).toBe(false)
  })

  it('should return true for numeric strings with leading/trailing spaces', () => {
    expect(isNumericString(' 123 ')).toBe(true)
    expect(isNumericString(' 0 ')).toBe(true)
    expect(isNumericString(' -123 ')).toBe(true)
    expect(isNumericString(' 0.123 ')).toBe(true)
    expect(isNumericString(' 1.23e+5 ')).toBe(true)
  })

  it('should return false for non-numeric strings with leading/trailing spaces', () => {
    expect(isNumericString(' abc ')).toBe(false)
    expect(isNumericString(' 123abc ')).toBe(false)
    expect(isNumericString(' ')).toBe(false)
    expect(isNumericString(' NaN ')).toBe(false)
    expect(isNumericString(' Infinity ')).toBe(false)
    expect(isNumericString(' -Infinity ')).toBe(false)
  })
})
