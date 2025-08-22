import { isNegativeNumber } from './isNegativeNumber'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isNegativeNumber.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isNegativeNumber(-5), true)
      assert.strictEqual(isNegativeNumber(0), true)
      assert.strictEqual(isNegativeNumber(5), false)
    }).not.toThrow()
  })

  describe('negative numbers and zero', () => {
    it('should return true for negative numbers', () => {
      expect(isNegativeNumber(-1)).toBe(true)
      expect(isNegativeNumber(-0.1)).toBe(true)
      expect(isNegativeNumber(-0.001)).toBe(true)
      expect(isNegativeNumber(-100)).toBe(true)
      expect(isNegativeNumber(-Math.PI)).toBe(true)
    })

    it('should return true for zero', () => {
      expect(isNegativeNumber(0)).toBe(true)
      expect(isNegativeNumber(-0)).toBe(true)
    })
  })

  describe('positive numbers', () => {
    it('should return false for positive numbers', () => {
      expect(isNegativeNumber(1)).toBe(false)
      expect(isNegativeNumber(0.1)).toBe(false)
      expect(isNegativeNumber(0.001)).toBe(false)
      expect(isNegativeNumber(100)).toBe(false)
      expect(isNegativeNumber(Math.PI)).toBe(false)
    })
  })

  describe('invalid numbers', () => {
    it('should return false for NaN and Infinity', () => {
      expect(isNegativeNumber(NaN)).toBe(false)
      expect(isNegativeNumber(Infinity)).toBe(false)
      expect(isNegativeNumber(-Infinity)).toBe(false)
    })
  })

  describe('non-numbers', () => {
    it('should return false for non-number values', () => {
      expect(isNegativeNumber('-5')).toBe(false)
      expect(isNegativeNumber('0')).toBe(false)
      expect(isNegativeNumber(null)).toBe(false)
      expect(isNegativeNumber(undefined)).toBe(false)
      expect(isNegativeNumber({})).toBe(false)
      expect(isNegativeNumber([])).toBe(false)
      expect(isNegativeNumber(false)).toBe(false)
    })
  })
})
