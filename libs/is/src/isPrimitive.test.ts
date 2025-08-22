import { isPrimitive } from './isPrimitive'
import { describe, expect, it } from 'vitest'

describe(isPrimitive.name, () => {
  it('examples', () => {
    expect(isPrimitive(123)).toBe(true)
    expect(isPrimitive({})).toBe(false)
  })

  describe('primitive values', () => {
    it('should return true for primitive types', () => {
      expect(isPrimitive(null)).toBe(true)
      expect(isPrimitive(undefined)).toBe(true)
      expect(isPrimitive(true)).toBe(true)
      expect(isPrimitive(false)).toBe(true)
      expect(isPrimitive(123)).toBe(true)
      expect(isPrimitive(0)).toBe(true)
      expect(isPrimitive(-123)).toBe(true)
      expect(isPrimitive(NaN)).toBe(true)
      expect(isPrimitive(Infinity)).toBe(true)
      expect(isPrimitive('string')).toBe(true)
      expect(isPrimitive('')).toBe(true)
      expect(isPrimitive(Symbol('test'))).toBe(true)
      expect(isPrimitive(BigInt(123))).toBe(true)
    })
  })

  describe('non-primitive values', () => {
    it('should return false for object types', () => {
      expect(isPrimitive({})).toBe(false)
      expect(isPrimitive([])).toBe(false)
      expect(isPrimitive([1, 2, 3])).toBe(false)
      expect(isPrimitive({ key: 'value' })).toBe(false)
      expect(isPrimitive(new Date())).toBe(false)
      expect(isPrimitive(/regex/)).toBe(false)
      expect(isPrimitive(new Map())).toBe(false)
      expect(isPrimitive(new Set())).toBe(false)
    })

    it('should return false for functions', () => {
      expect(isPrimitive(() => {})).toBe(false)
      expect(isPrimitive(function () {})).toBe(false)
      expect(isPrimitive(class Test {})).toBe(false)
    })
  })
})
