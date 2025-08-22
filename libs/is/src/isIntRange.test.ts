import { isIntRange } from './isIntRange'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isIntRange.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isIntRange([1, 2]), true)
      assert.strictEqual(isIntRange([1, 1]), true)
      assert.strictEqual(isIntRange([-1, 0]), true)
      assert.strictEqual(isIntRange([2, 1]), false) // not ascending
      assert.strictEqual(isIntRange([1, 2, 3]), false) // length not 2
      assert.strictEqual(isIntRange([1]), false) // length not 2
    }).not.toThrow()
  })

  describe('valid integer ranges', () => {
    it('should return true for ascending integer pairs', () => {
      expect(isIntRange([1, 2])).toBe(true)
      expect(isIntRange([0, 1])).toBe(true)
      expect(isIntRange([-5, -3])).toBe(true)
      expect(isIntRange([-1, 0])).toBe(true)
      expect(isIntRange([0, 100])).toBe(true)
    })

    it('should return true for equal integer pairs', () => {
      expect(isIntRange([1, 1])).toBe(true)
      expect(isIntRange([0, 0])).toBe(true)
      expect(isIntRange([-5, -5])).toBe(true)
      expect(isIntRange([100, 100])).toBe(true)
    })
  })

  describe('invalid ranges', () => {
    it('should return false for descending pairs', () => {
      expect(isIntRange([2, 1])).toBe(false)
      expect(isIntRange([1, 0])).toBe(false)
      expect(isIntRange([0, -1])).toBe(false)
      expect(isIntRange([100, 0])).toBe(false)
    })

    it('should return false for wrong length', () => {
      expect(isIntRange([])).toBe(false)
      expect(isIntRange([1])).toBe(false)
      expect(isIntRange([1, 2, 3])).toBe(false)
      expect(isIntRange([1, 2, 3, 4])).toBe(false)
    })

    it('should return false for arrays with non-numbers', () => {
      expect(isIntRange(['1', '2'])).toBe(false)
      expect(isIntRange([1, '2'])).toBe(false)
      expect(isIntRange(['1', 2])).toBe(false)
      expect(isIntRange([null, null])).toBe(false)
      expect(isIntRange([undefined, undefined])).toBe(false)
    })

    it('should return false for arrays with non-finite numbers', () => {
      expect(isIntRange([NaN, NaN])).toBe(false)
      expect(isIntRange([1, NaN])).toBe(false)
      expect(isIntRange([NaN, 1])).toBe(false)
      expect(isIntRange([Infinity, Infinity])).toBe(false)
      expect(isIntRange([1, Infinity])).toBe(false)
      expect(isIntRange([-Infinity, 1])).toBe(false)
    })

    it('should return false for arrays with decimals', () => {
      expect(isIntRange([1.5, 2.5])).toBe(false)
      expect(isIntRange([1, 2.5])).toBe(false)
      expect(isIntRange([1.5, 2])).toBe(false)
    })
  })

  describe('non-arrays', () => {
    it('should return false for non-array inputs', () => {
      expect(isIntRange(null)).toBe(false)
      expect(isIntRange(undefined)).toBe(false)
      expect(isIntRange('string')).toBe(false)
      expect(isIntRange(123)).toBe(false)
      expect(isIntRange({})).toBe(false)
      expect(isIntRange({ length: 2 })).toBe(false)
    })
  })
})
