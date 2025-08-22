import { isPositiveInteger } from './isPositiveInteger'
import { describe, expect, it } from 'vitest'

describe('isPositiveInteger', () => {
  it('should return true for positive integers', () => {
    expect(isPositiveInteger(1)).toBe(true)
    expect(isPositiveInteger(100)).toBe(true)
    expect(isPositiveInteger(999999999)).toBe(true)
  })

  it('should return true for zero', () => {
    expect(isPositiveInteger(0)).toBe(true)
  })

  it('should return false for negative integers', () => {
    expect(isPositiveInteger(-1)).toBe(false)
    expect(isPositiveInteger(-100)).toBe(false)
    expect(isPositiveInteger(-999999999)).toBe(false)
  })

  it('should return false for non-integers', () => {
    expect(isPositiveInteger(1.1)).toBe(false)
    expect(isPositiveInteger(-1.1)).toBe(false)
    expect(isPositiveInteger(0.0000001)).toBe(false)
  })

  it('should return false for invalid numbers', () => {
    expect(isPositiveInteger(Infinity)).toBe(false)
    expect(isPositiveInteger(NaN)).toBe(false)
  })
})
