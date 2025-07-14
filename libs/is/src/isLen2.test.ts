import { isLen2 } from './isLen2'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isLen2.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isLen2('12'), true)
      assert.strictEqual(isLen2([1, 2]), true)
      assert.strictEqual(isLen2('1'), false)
      assert.strictEqual(isLen2([1]), false)
    }).not.toThrow()
  })

  describe('valid length 2 values', () => {
    it('should return true for strings with length 2', () => {
      expect(isLen2('ab')).toBe(true)
      expect(isLen2('12')).toBe(true)
      expect(isLen2('  ')).toBe(true)
      expect(isLen2('!@')).toBe(true)
    })

    it('should return true for arrays with length 2', () => {
      expect(isLen2([1, 2])).toBe(true)
      expect(isLen2(['a', 'b'])).toBe(true)
      expect(isLen2([null, undefined])).toBe(true)
      expect(isLen2([{}, {}])).toBe(true)
    })

    it('should return true for other objects with length 2', () => {
      expect(isLen2({ length: 2 })).toBe(true)
      expect(isLen2({ length: 2, other: 'prop' })).toBe(true)
    })
  })

  describe('invalid length values', () => {
    it('should return false for strings with different lengths', () => {
      expect(isLen2('')).toBe(false)
      expect(isLen2('a')).toBe(false)
      expect(isLen2('abc')).toBe(false)
      expect(isLen2('hello world')).toBe(false)
    })

    it('should return false for arrays with different lengths', () => {
      expect(isLen2([])).toBe(false)
      expect(isLen2([1])).toBe(false)
      expect(isLen2([1, 2, 3])).toBe(false)
      expect(isLen2([1, 2, 3, 4, 5])).toBe(false)
    })

    it('should return false for objects with different lengths', () => {
      expect(isLen2({ length: 0 })).toBe(false)
      expect(isLen2({ length: 1 })).toBe(false)
      expect(isLen2({ length: 3 })).toBe(false)
      expect(isLen2({ length: 10 })).toBe(false)
    })
  })

  describe('invalid inputs', () => {
    it('should return false for values without length property', () => {
      expect(isLen2(null)).toBe(false)
      expect(isLen2(undefined)).toBe(false)
      expect(isLen2(123)).toBe(false)
      expect(isLen2(true)).toBe(false)
      expect(isLen2({})).toBe(false)
    })

    it('should return false for values with non-numeric length', () => {
      expect(isLen2({ length: '2' })).toBe(false)
      expect(isLen2({ length: null })).toBe(false)
      expect(isLen2({ length: undefined })).toBe(false)
      expect(isLen2({ length: {} })).toBe(false)
    })
  })
})
