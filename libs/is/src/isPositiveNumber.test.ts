import { isPositiveNumber } from './isPositiveNumber'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isPositiveNumber.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isPositiveNumber(5), true)
      assert.strictEqual(isPositiveNumber(0), true)
      assert.strictEqual(isPositiveNumber(-5), false)
    }).not.toThrow()
  })

  describe('positive numbers', () => {
    it('should return true for positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(true)
      expect(isPositiveNumber(1)).toBe(true)
      expect(isPositiveNumber(0.1)).toBe(true)
      expect(isPositiveNumber(100)).toBe(true)
      expect(isPositiveNumber(Math.PI)).toBe(true)
    })
  })

  describe('negative numbers', () => {
    it('should return false for negative numbers', () => {
      expect(isPositiveNumber(-1)).toBe(false)
      expect(isPositiveNumber(-0.1)).toBe(false)
      expect(isPositiveNumber(-100)).toBe(false)
    })
  })

  describe('invalid numbers', () => {
    it('should return false for NaN and Infinity', () => {
      expect(isPositiveNumber(NaN)).toBe(false)
      expect(isPositiveNumber(Infinity)).toBe(false)
      expect(isPositiveNumber(-Infinity)).toBe(false)
    })
  })

  describe('non-numbers', () => {
    it('should return false for non-number values', () => {
      expect(isPositiveNumber('5')).toBe(false)
      expect(isPositiveNumber('0')).toBe(false)
      expect(isPositiveNumber(null)).toBe(false)
      expect(isPositiveNumber(undefined)).toBe(false)
      expect(isPositiveNumber({})).toBe(false)
      expect(isPositiveNumber([])).toBe(false)
      expect(isPositiveNumber(true)).toBe(false)
    })
  })
})
