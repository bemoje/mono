import { isNumArrayAscending } from './isNumArrayAscending'
import { describe, expect, it } from 'vitest'

describe(isNumArrayAscending.name, () => {
  it('examples', () => {
    expect(isNumArrayAscending([1, 2])).toBe(true)
    expect(isNumArrayAscending([1, 1])).toBe(true)
    expect(isNumArrayAscending([1, 0])).toBe(false)
  })

  describe('valid arrays', () => {
    it('should return true for ascending number arrays', () => {
      expect(isNumArrayAscending([])).toBe(true)
      expect(isNumArrayAscending([1])).toBe(true)
      expect(isNumArrayAscending([1, 2, 3])).toBe(true)
      expect(isNumArrayAscending([1, 1, 2, 2, 3])).toBe(true)
      expect(isNumArrayAscending([-3, -1, 0, 1, 2])).toBe(true)
    })
  })

  describe('invalid arrays', () => {
    it('should return false for non-ascending arrays', () => {
      expect(isNumArrayAscending([2, 1])).toBe(false)
      expect(isNumArrayAscending([1, 3, 2])).toBe(false)
      expect(isNumArrayAscending([3, 2, 1])).toBe(false)
    })

    it('should return false for arrays with non-number elements', () => {
      expect(isNumArrayAscending(['1', '2'])).toBe(false)
      expect(isNumArrayAscending([1, '2'])).toBe(false)
      expect(isNumArrayAscending([1, null])).toBe(false)
      expect(isNumArrayAscending([1, undefined])).toBe(false)
      expect(isNumArrayAscending([1, {}])).toBe(false)
    })

    it('should return false for arrays with NaN or Infinity', () => {
      expect(isNumArrayAscending([1, NaN])).toBe(false)
      expect(isNumArrayAscending([1, Infinity])).toBe(false)
      expect(isNumArrayAscending([1, -Infinity])).toBe(false)
    })
  })

  describe('non-arrays', () => {
    it('should return false for non-array inputs', () => {
      expect(isNumArrayAscending(null)).toBe(false)
      expect(isNumArrayAscending(undefined)).toBe(false)
      expect(isNumArrayAscending('string')).toBe(false)
      expect(isNumArrayAscending(123)).toBe(false)
      expect(isNumArrayAscending({})).toBe(false)
    })
  })
})
