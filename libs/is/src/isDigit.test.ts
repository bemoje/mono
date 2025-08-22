import { isDigit } from './isDigit'
import { describe, expect, it } from 'vitest'

describe(isDigit.name, () => {
  it('should return true for digit characters', () => {
    expect(isDigit('0')).toBe(true)
    expect(isDigit('1')).toBe(true)
    expect(isDigit('5')).toBe(true)
    expect(isDigit('9')).toBe(true)
  })

  it('should return false for non-digit characters', () => {
    expect(isDigit('a')).toBe(false)
    expect(isDigit('A')).toBe(false)
    expect(isDigit(' ')).toBe(false)
    expect(isDigit('!')).toBe(false)
    expect(isDigit('€')).toBe(false)
  })
})
