import { isPosIntArray } from './isPosIntArray'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isPosIntArray.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isPosIntArray([1, 2]), true)
      assert.strictEqual(isPosIntArray([1, 0]), true)
      assert.strictEqual(isPosIntArray([1, -1]), false)
    }).not.toThrow()
  })

  describe('valid positive integer arrays', () => {
    it('should return true for arrays of positive integers', () => {
      expect(isPosIntArray([])).toBe(true)
      expect(isPosIntArray([0])).toBe(true)
      expect(isPosIntArray([1])).toBe(true)
      expect(isPosIntArray([1, 2, 3])).toBe(true)
      expect(isPosIntArray([0, 1, 2, 3])).toBe(true)
      expect(isPosIntArray([100, 200, 300])).toBe(true)
    })
  })

  describe('invalid arrays', () => {
    it('should return false for arrays with negative integers', () => {
      expect(isPosIntArray([-1])).toBe(false)
      expect(isPosIntArray([1, -1])).toBe(false)
      expect(isPosIntArray([-1, 1])).toBe(false)
      expect(isPosIntArray([-1, -2, -3])).toBe(false)
    })

    it('should return false for arrays with non-integers', () => {
      expect(isPosIntArray([1.5])).toBe(false)
      expect(isPosIntArray([1, 2.5])).toBe(false)
      expect(isPosIntArray([0.1, 0.2])).toBe(false)
    })

    it('should return false for arrays with non-numbers', () => {
      expect(isPosIntArray(['1'])).toBe(false)
      expect(isPosIntArray([1, '2'])).toBe(false)
      expect(isPosIntArray([null])).toBe(false)
      expect(isPosIntArray([undefined])).toBe(false)
      expect(isPosIntArray([{}])).toBe(false)
    })

    it('should return false for arrays with NaN or Infinity', () => {
      expect(isPosIntArray([NaN])).toBe(false)
      expect(isPosIntArray([Infinity])).toBe(false)
      expect(isPosIntArray([1, NaN])).toBe(false)
      expect(isPosIntArray([1, Infinity])).toBe(false)
    })
  })

  describe('non-arrays', () => {
    it('should return false for non-array inputs', () => {
      expect(isPosIntArray(null)).toBe(false)
      expect(isPosIntArray(undefined)).toBe(false)
      expect(isPosIntArray('string')).toBe(false)
      expect(isPosIntArray(123)).toBe(false)
      expect(isPosIntArray({})).toBe(false)
    })
  })
})
