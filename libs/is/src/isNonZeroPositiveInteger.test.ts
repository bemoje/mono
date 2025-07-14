import { isNonZeroPositiveInteger } from './isNonZeroPositiveInteger'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isNonZeroPositiveInteger.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isNonZeroPositiveInteger(5), true)
      assert.strictEqual(isNonZeroPositiveInteger(-5), false)
      assert.strictEqual(isNonZeroPositiveInteger(0), false)
      assert.strictEqual(isNonZeroPositiveInteger(5.5), false)
    }).not.toThrow()
  })

  describe('positive non-zero integers', () => {
    it('should return true for positive non-zero integers', () => {
      expect(isNonZeroPositiveInteger(1)).toBe(true)
      expect(isNonZeroPositiveInteger(2)).toBe(true)
      expect(isNonZeroPositiveInteger(100)).toBe(true)
      expect(isNonZeroPositiveInteger(1000)).toBe(true)
    })
  })

  describe('zero and negative integers', () => {
    it('should return false for zero', () => {
      expect(isNonZeroPositiveInteger(0)).toBe(false)
      expect(isNonZeroPositiveInteger(-0)).toBe(false)
    })

    it('should return false for negative integers', () => {
      expect(isNonZeroPositiveInteger(-1)).toBe(false)
      expect(isNonZeroPositiveInteger(-2)).toBe(false)
      expect(isNonZeroPositiveInteger(-100)).toBe(false)
    })
  })

  describe('non-integers', () => {
    it('should return false for decimal numbers', () => {
      expect(isNonZeroPositiveInteger(1.1)).toBe(false)
      expect(isNonZeroPositiveInteger(0.1)).toBe(false)
      expect(isNonZeroPositiveInteger(Math.PI)).toBe(false)
      expect(isNonZeroPositiveInteger(-1.1)).toBe(false)
    })

    it('should return false for NaN and Infinity', () => {
      expect(isNonZeroPositiveInteger(NaN)).toBe(false)
      expect(isNonZeroPositiveInteger(Infinity)).toBe(false)
      expect(isNonZeroPositiveInteger(-Infinity)).toBe(false)
    })
  })

  describe('non-numbers', () => {
    it('should return false for non-number values', () => {
      expect(isNonZeroPositiveInteger('5')).toBe(false)
      expect(isNonZeroPositiveInteger('1')).toBe(false)
      expect(isNonZeroPositiveInteger(null)).toBe(false)
      expect(isNonZeroPositiveInteger(undefined)).toBe(false)
      expect(isNonZeroPositiveInteger({})).toBe(false)
      expect(isNonZeroPositiveInteger([])).toBe(false)
      expect(isNonZeroPositiveInteger(true)).toBe(false)
    })
  })
})
