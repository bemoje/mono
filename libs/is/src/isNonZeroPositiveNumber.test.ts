import { isNonZeroPositiveNumber } from './isNonZeroPositiveNumber'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isNonZeroPositiveNumber.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isNonZeroPositiveNumber(5), true)
      assert.strictEqual(isNonZeroPositiveNumber(0.1), true)
      assert.strictEqual(isNonZeroPositiveNumber(0), false)
      assert.strictEqual(isNonZeroPositiveNumber(-5), false)
    }).not.toThrow()
  })

  describe('positive non-zero numbers', () => {
    it('should return true for positive non-zero numbers', () => {
      expect(isNonZeroPositiveNumber(1)).toBe(true)
      expect(isNonZeroPositiveNumber(0.1)).toBe(true)
      expect(isNonZeroPositiveNumber(0.001)).toBe(true)
      expect(isNonZeroPositiveNumber(100)).toBe(true)
      expect(isNonZeroPositiveNumber(Math.PI)).toBe(true)
    })
  })

  describe('zero and negative numbers', () => {
    it('should return false for zero', () => {
      expect(isNonZeroPositiveNumber(0)).toBe(false)
      expect(isNonZeroPositiveNumber(-0)).toBe(false)
    })

    it('should return false for negative numbers', () => {
      expect(isNonZeroPositiveNumber(-1)).toBe(false)
      expect(isNonZeroPositiveNumber(-0.1)).toBe(false)
      expect(isNonZeroPositiveNumber(-100)).toBe(false)
    })
  })

  describe('invalid numbers', () => {
    it('should return false for NaN and Infinity', () => {
      expect(isNonZeroPositiveNumber(NaN)).toBe(false)
      expect(isNonZeroPositiveNumber(Infinity)).toBe(false)
      expect(isNonZeroPositiveNumber(-Infinity)).toBe(false)
    })
  })

  describe('non-numbers', () => {
    it('should return false for non-number values', () => {
      expect(isNonZeroPositiveNumber('5')).toBe(false)
      expect(isNonZeroPositiveNumber('1')).toBe(false)
      expect(isNonZeroPositiveNumber(null)).toBe(false)
      expect(isNonZeroPositiveNumber(undefined)).toBe(false)
      expect(isNonZeroPositiveNumber({})).toBe(false)
      expect(isNonZeroPositiveNumber([])).toBe(false)
      expect(isNonZeroPositiveNumber(true)).toBe(false)
    })
  })
})
