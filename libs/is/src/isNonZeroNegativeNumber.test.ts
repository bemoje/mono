import { isNonZeroNegativeNumber } from './isNonZeroNegativeNumber'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isNonZeroNegativeNumber.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isNonZeroNegativeNumber(-5), true)
      assert.strictEqual(isNonZeroNegativeNumber(-0.1), true)
      assert.strictEqual(isNonZeroNegativeNumber(0), false)
      assert.strictEqual(isNonZeroNegativeNumber(5), false)
    }).not.toThrow()
  })

  describe('negative non-zero numbers', () => {
    it('should return true for negative non-zero numbers', () => {
      expect(isNonZeroNegativeNumber(-1)).toBe(true)
      expect(isNonZeroNegativeNumber(-0.1)).toBe(true)
      expect(isNonZeroNegativeNumber(-0.001)).toBe(true)
      expect(isNonZeroNegativeNumber(-100)).toBe(true)
      expect(isNonZeroNegativeNumber(-Math.PI)).toBe(true)
    })
  })

  describe('zero and positive numbers', () => {
    it('should return false for zero', () => {
      expect(isNonZeroNegativeNumber(0)).toBe(false)
      expect(isNonZeroNegativeNumber(-0)).toBe(false)
    })

    it('should return false for positive numbers', () => {
      expect(isNonZeroNegativeNumber(1)).toBe(false)
      expect(isNonZeroNegativeNumber(0.1)).toBe(false)
      expect(isNonZeroNegativeNumber(100)).toBe(false)
    })
  })

  describe('invalid numbers', () => {
    it('should return false for NaN and Infinity', () => {
      expect(isNonZeroNegativeNumber(NaN)).toBe(false)
      expect(isNonZeroNegativeNumber(Infinity)).toBe(false)
      expect(isNonZeroNegativeNumber(-Infinity)).toBe(false)
    })
  })

  describe('non-numbers', () => {
    it('should return false for non-number values', () => {
      expect(isNonZeroNegativeNumber('-5')).toBe(false)
      expect(isNonZeroNegativeNumber('-1')).toBe(false)
      expect(isNonZeroNegativeNumber(null)).toBe(false)
      expect(isNonZeroNegativeNumber(undefined)).toBe(false)
      expect(isNonZeroNegativeNumber({})).toBe(false)
      expect(isNonZeroNegativeNumber([])).toBe(false)
      expect(isNonZeroNegativeNumber(false)).toBe(false)
    })
  })
})
