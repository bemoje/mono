import { describe, expect, it } from 'vitest'
import { ignoreValuesFilterDefaults } from './ignoreValuesFilterDefaults'

describe('ignoreValuesFilterDefaults', () => {
  describe('noFalse', () => {
    it('should return false for false value', () => {
      expect(ignoreValuesFilterDefaults.noFalse(false)).toBe(false)
    })

    it('should return true for non-false values', () => {
      expect(ignoreValuesFilterDefaults.noFalse(true)).toBe(true)
      expect(ignoreValuesFilterDefaults.noFalse(0)).toBe(true)
      expect(ignoreValuesFilterDefaults.noFalse('')).toBe(true)
      expect(ignoreValuesFilterDefaults.noFalse(null)).toBe(true)
      expect(ignoreValuesFilterDefaults.noFalse(undefined)).toBe(true)
      expect(ignoreValuesFilterDefaults.noFalse({})).toBe(true)
      expect(ignoreValuesFilterDefaults.noFalse([])).toBe(true)
    })
  })

  describe('noNull', () => {
    it('should return false for null value', () => {
      expect(ignoreValuesFilterDefaults.noNull(null)).toBe(false)
    })

    it('should return true for non-null values', () => {
      expect(ignoreValuesFilterDefaults.noNull(false)).toBe(true)
      expect(ignoreValuesFilterDefaults.noNull(true)).toBe(true)
      expect(ignoreValuesFilterDefaults.noNull(0)).toBe(true)
      expect(ignoreValuesFilterDefaults.noNull('')).toBe(true)
      expect(ignoreValuesFilterDefaults.noNull(undefined)).toBe(true)
      expect(ignoreValuesFilterDefaults.noNull({})).toBe(true)
      expect(ignoreValuesFilterDefaults.noNull([])).toBe(true)
    })
  })

  describe('noUndefined', () => {
    it('should return false for undefined value', () => {
      expect(ignoreValuesFilterDefaults.noUndefined(undefined)).toBe(false)
    })

    it('should return true for non-undefined values', () => {
      expect(ignoreValuesFilterDefaults.noUndefined(false)).toBe(true)
      expect(ignoreValuesFilterDefaults.noUndefined(true)).toBe(true)
      expect(ignoreValuesFilterDefaults.noUndefined(0)).toBe(true)
      expect(ignoreValuesFilterDefaults.noUndefined('')).toBe(true)
      expect(ignoreValuesFilterDefaults.noUndefined(null)).toBe(true)
      expect(ignoreValuesFilterDefaults.noUndefined({})).toBe(true)
      expect(ignoreValuesFilterDefaults.noUndefined([])).toBe(true)
    })
  })

  describe('noEmptyArray', () => {
    it('should return false for empty arrays', () => {
      expect(ignoreValuesFilterDefaults.noEmptyArray([])).toBe(false)
    })

    it('should return true for non-empty arrays', () => {
      expect(ignoreValuesFilterDefaults.noEmptyArray([1])).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyArray([''])).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyArray([null])).toBe(true)
    })

    it('should return true for non-array values', () => {
      expect(ignoreValuesFilterDefaults.noEmptyArray(false)).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyArray(0)).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyArray('')).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyArray(null)).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyArray(undefined)).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyArray({})).toBe(true)
    })
  })

  describe('noEmptyObject', () => {
    it('should return false for empty objects', () => {
      expect(ignoreValuesFilterDefaults.noEmptyObject({})).toBe(false)
    })

    it('should return true for non-empty objects', () => {
      expect(ignoreValuesFilterDefaults.noEmptyObject({ a: 1 })).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyObject({ a: null })).toBe(true)
    })

    it('should return true for arrays (even empty ones)', () => {
      expect(ignoreValuesFilterDefaults.noEmptyObject([])).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyObject([1, 2])).toBe(true)
    })

    it('should return true for primitives', () => {
      expect(ignoreValuesFilterDefaults.noEmptyObject(false)).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyObject(0)).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyObject('')).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyObject(null)).toBe(true)
      expect(ignoreValuesFilterDefaults.noEmptyObject(undefined)).toBe(true)
    })
  })
})
