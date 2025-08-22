import { isNonZeroNegativeInteger } from './isNonZeroNegativeInteger'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isNonZeroNegativeInteger.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isNonZeroNegativeInteger(-5), true)
      assert.strictEqual(isNonZeroNegativeInteger(0), false)
      assert.strictEqual(isNonZeroNegativeInteger(5), false)
    }).not.toThrow()
  })

  describe('negative non-zero integers', () => {
    it('should return true for negative non-zero integers', () => {
      expect(isNonZeroNegativeInteger(-1)).toBe(true)
      expect(isNonZeroNegativeInteger(-2)).toBe(true)
      expect(isNonZeroNegativeInteger(-100)).toBe(true)
      expect(isNonZeroNegativeInteger(-1000)).toBe(true)
    })
  })

  describe('zero and positive integers', () => {
    it('should return false for zero', () => {
      expect(isNonZeroNegativeInteger(0)).toBe(false)
      expect(isNonZeroNegativeInteger(-0)).toBe(false)
    })

    it('should return false for positive integers', () => {
      expect(isNonZeroNegativeInteger(1)).toBe(false)
      expect(isNonZeroNegativeInteger(2)).toBe(false)
      expect(isNonZeroNegativeInteger(100)).toBe(false)
    })
  })

  describe('non-integers', () => {
    it('should return false for decimal numbers', () => {
      expect(isNonZeroNegativeInteger(-1.1)).toBe(false)
      expect(isNonZeroNegativeInteger(-0.1)).toBe(false)
      expect(isNonZeroNegativeInteger(-Math.PI)).toBe(false)
      expect(isNonZeroNegativeInteger(1.1)).toBe(false)
    })

    it('should return false for NaN and Infinity', () => {
      expect(isNonZeroNegativeInteger(NaN)).toBe(false)
      expect(isNonZeroNegativeInteger(Infinity)).toBe(false)
      expect(isNonZeroNegativeInteger(-Infinity)).toBe(false)
    })
  })

  describe('non-numbers', () => {
    it('should return false for non-number values', () => {
      expect(isNonZeroNegativeInteger('-5')).toBe(false)
      expect(isNonZeroNegativeInteger('-1')).toBe(false)
      expect(isNonZeroNegativeInteger(null)).toBe(false)
      expect(isNonZeroNegativeInteger(undefined)).toBe(false)
      expect(isNonZeroNegativeInteger({})).toBe(false)
      expect(isNonZeroNegativeInteger([])).toBe(false)
      expect(isNonZeroNegativeInteger(false)).toBe(false)
    })
  })
})
