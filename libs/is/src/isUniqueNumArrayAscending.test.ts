import { isUniqueNumArrayAscending } from './isUniqueNumArrayAscending'
import { describe, expect, it } from 'vitest'

describe(isUniqueNumArrayAscending.name, () => {
  it('examples', () => {
    expect(isUniqueNumArrayAscending([1, 2])).toBe(true)
    expect(isUniqueNumArrayAscending([1, 1])).toBe(false)
    expect(isUniqueNumArrayAscending([1, 0])).toBe(false)
  })

  describe('valid arrays', () => {
    it('should return true for strictly ascending number arrays', () => {
      expect(isUniqueNumArrayAscending([])).toBe(true)
      expect(isUniqueNumArrayAscending([1])).toBe(true)
      expect(isUniqueNumArrayAscending([1, 2, 3])).toBe(true)
      expect(isUniqueNumArrayAscending([-3, -1, 0, 1, 2])).toBe(true)
    })
  })

  describe('invalid arrays', () => {
    it('should return false for arrays with duplicates', () => {
      expect(isUniqueNumArrayAscending([1, 1])).toBe(false)
      expect(isUniqueNumArrayAscending([1, 2, 2])).toBe(false)
      expect(isUniqueNumArrayAscending([1, 1, 2])).toBe(false)
    })

    it('should return false for non-ascending arrays', () => {
      expect(isUniqueNumArrayAscending([2, 1])).toBe(false)
      expect(isUniqueNumArrayAscending([1, 3, 2])).toBe(false)
      expect(isUniqueNumArrayAscending([3, 2, 1])).toBe(false)
    })

    it('should return false for arrays with non-number elements', () => {
      expect(isUniqueNumArrayAscending(['1', '2'])).toBe(false)
      expect(isUniqueNumArrayAscending([1, '2'])).toBe(false)
      expect(isUniqueNumArrayAscending([1, null])).toBe(false)
      expect(isUniqueNumArrayAscending([1, undefined])).toBe(false)
      expect(isUniqueNumArrayAscending([1, {}])).toBe(false)
    })

    it('should return false for arrays with NaN or Infinity', () => {
      expect(isUniqueNumArrayAscending([1, NaN])).toBe(false)
      expect(isUniqueNumArrayAscending([1, Infinity])).toBe(false)
      expect(isUniqueNumArrayAscending([1, -Infinity])).toBe(false)
    })
  })

  describe('non-arrays', () => {
    it('should return false for non-array inputs', () => {
      expect(isUniqueNumArrayAscending(null)).toBe(false)
      expect(isUniqueNumArrayAscending(undefined)).toBe(false)
      expect(isUniqueNumArrayAscending('string')).toBe(false)
      expect(isUniqueNumArrayAscending(123)).toBe(false)
      expect(isUniqueNumArrayAscending({})).toBe(false)
    })
  })
})
