import { isChar } from './isChar'
import { describe, expect, it } from 'vitest'

describe(isChar.name, () => {
  it('should return true for single character strings', () => {
    expect(isChar('a')).toBe(true)
    expect(isChar('A')).toBe(true)
    expect(isChar('1')).toBe(true)
    expect(isChar(' ')).toBe(true)
    expect(isChar('!')).toBe(true)
    expect(isChar('€')).toBe(true)
  })

  it('should return false for empty strings', () => {
    expect(isChar('')).toBe(false)
  })

  it('should return false for multi-character strings', () => {
    expect(isChar('ab')).toBe(false)
    expect(isChar('hello')).toBe(false)
    expect(isChar('  ')).toBe(false)
  })
})
