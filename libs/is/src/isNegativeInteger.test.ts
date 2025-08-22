import { isNegativeInteger } from './isNegativeInteger'
import { describe, expect, it } from 'vitest'

describe('isNegativeInteger', () => {
  it('should return true for negative integers', () => {
    expect(isNegativeInteger(-1)).toBe(true)
    expect(isNegativeInteger(-100)).toBe(true)
  })

  it('should return false for positive integers', () => {
    expect(isNegativeInteger(1)).toBe(false)
    expect(isNegativeInteger(100)).toBe(false)
  })

  it('should return true for zero', () => {
    expect(isNegativeInteger(0)).toBe(true)
  })

  it('should return false for non-integer numbers', () => {
    expect(isNegativeInteger(-1.5)).toBe(false)
    expect(isNegativeInteger(1.5)).toBe(false)
  })

  it('should return false for invalid numbers', () => {
    expect(isNegativeInteger(Infinity)).toBe(false)
    expect(isNegativeInteger(NaN)).toBe(false)
  })
})
