import { createGtValidator } from './createGtValidator'
import { describe, expect, it } from 'vitest'

describe(createGtValidator.name, () => {
  it('should create a validator with correct name', () => {
    const isGt5 = createGtValidator(5)
    expect(isGt5.name).toBe('isGt5')

    const isGt0 = createGtValidator(0)
    expect(isGt0.name).toBe('isGt0')

    const isGtNeg10 = createGtValidator(-10)
    expect(isGtNeg10.name).toBe('isGt-10')
  })

  describe('validator function behavior', () => {
    const isGt5 = createGtValidator(5)

    it('should return true for values greater than limit', () => {
      expect(isGt5(6)).toBe(true)
      expect(isGt5(100)).toBe(true)
      expect(isGt5(5.1)).toBe(true)
    })

    it('should return false for values less than or equal to limit', () => {
      expect(isGt5(5)).toBe(false)
      expect(isGt5(4)).toBe(false)
      expect(isGt5(0)).toBe(false)
      expect(isGt5(-1)).toBe(false)
      expect(isGt5(4.9)).toBe(false)
    })

    it('should return false for non-number values', () => {
      expect(isGt5('6')).toBe(false)
      expect(isGt5('10')).toBe(false)
      expect(isGt5(null)).toBe(false)
      expect(isGt5(undefined)).toBe(false)
      expect(isGt5({})).toBe(false)
      expect(isGt5([])).toBe(false)
      expect(isGt5(true)).toBe(false)
    })

    it('should return false for NaN and Infinity', () => {
      expect(isGt5(NaN)).toBe(false)
      expect(isGt5(Infinity)).toBe(false)
      expect(isGt5(-Infinity)).toBe(false)
    })
  })
})
