import { isValidNumber } from './isValidNumber'
import { describe, expect, it } from 'vitest'

describe('isValidNumber', () => {
  it('should return true for valid numbers', () => {
    expect(isValidNumber(0)).toBe(true)
    expect(isValidNumber(123)).toBe(true)
    expect(isValidNumber(-123)).toBe(true)
    expect(isValidNumber(1.23)).toBe(true)
    expect(isValidNumber(-1.23)).toBe(true)
  })

  it('should return false for Infinity', () => {
    expect(isValidNumber(Infinity)).toBe(false)
    expect(isValidNumber(-Infinity)).toBe(false)
  })

  it('should return false for NaN', () => {
    expect(isValidNumber(NaN)).toBe(false)
  })
})
