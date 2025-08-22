import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { isEnumerable } from './isEnumerable'

describe(isEnumerable.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { a: 1, b: 2 }
      Object.defineProperty(obj, 'c', { value: 3, enumerable: false })

      // Enumerable property
      assert.strictEqual(isEnumerable(obj, 'a'), true)

      // Non-enumerable property
      assert.strictEqual(isEnumerable(obj, 'c'), false)

      // Non-existent property
      assert.strictEqual(isEnumerable(obj, 'nonExistent'), false)
    }).not.toThrow()
  })

  describe('enumerable properties', () => {
    it('should return true for enumerable properties', () => {
      const obj = { test: 'value' }
      expect(isEnumerable(obj, 'test')).toBe(true)
    })

    it('should return true for array indices', () => {
      const arr = [1, 2, 3]
      expect(isEnumerable(arr, 0)).toBe(true)
      expect(isEnumerable(arr, '1')).toBe(true)
    })
  })

  describe('non-enumerable properties', () => {
    it('should return false for non-enumerable properties', () => {
      const obj = {}
      Object.defineProperty(obj, 'hidden', { value: 'secret', enumerable: false })
      expect(isEnumerable(obj, 'hidden')).toBe(false)
    })

    it('should return false for built-in non-enumerable properties', () => {
      const arr = [1, 2, 3]
      expect(isEnumerable(arr, 'length')).toBe(false)
    })

    it('should return false for prototype properties', () => {
      const obj = {}
      expect(isEnumerable(obj, 'toString')).toBe(false)
      expect(isEnumerable(obj, 'hasOwnProperty')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should return false for non-existent properties', () => {
      const obj = { a: 1 }
      expect(isEnumerable(obj, 'nonExistent')).toBe(false)
    })

    it('should work with symbol keys', () => {
      const sym = Symbol('test')
      const obj = { [sym]: 'value' }
      expect(isEnumerable(obj, sym)).toBe(true)
    })

    it('should work with number keys', () => {
      const obj = { 123: 'value' }
      expect(isEnumerable(obj, 123)).toBe(true)
      expect(isEnumerable(obj, '123')).toBe(true)
    })
  })
})
