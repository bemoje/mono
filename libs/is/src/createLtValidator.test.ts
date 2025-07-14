import { createLtValidator } from './createLtValidator'
import { describe, expect, it } from 'vitest'

describe(createLtValidator.name, () => {
  it('should create a validator with correct name', () => {
    const isLt5 = createLtValidator(5)
    expect(isLt5.name).toBe('isLt5')

    const isLt0 = createLtValidator(0)
    expect(isLt0.name).toBe('isLt0')

    const isLtNeg10 = createLtValidator(-10)
    expect(isLtNeg10.name).toBe('isLt-10')
  })

  describe('validator function behavior', () => {
    const isLt5 = createLtValidator(5)

    it('should return true for values less than limit', () => {
      expect(isLt5(4)).toBe(true)
      expect(isLt5(0)).toBe(true)
      expect(isLt5(-1)).toBe(true)
      expect(isLt5(4.9)).toBe(true)
    })

    it('should return false for values greater than or equal to limit', () => {
      expect(isLt5(5)).toBe(false)
      expect(isLt5(6)).toBe(false)
      expect(isLt5(100)).toBe(false)
      expect(isLt5(5.1)).toBe(false)
    })

    it('should return false for non-number values', () => {
      expect(isLt5('4')).toBe(false)
      expect(isLt5('0')).toBe(false)
      expect(isLt5(null)).toBe(false)
      expect(isLt5(undefined)).toBe(false)
      expect(isLt5({})).toBe(false)
      expect(isLt5([])).toBe(false)
      expect(isLt5(true)).toBe(false)
    })

    it('should return false for NaN and Infinity', () => {
      expect(isLt5(NaN)).toBe(false)
      expect(isLt5(Infinity)).toBe(false)
      expect(isLt5(-Infinity)).toBe(false)
    })
  })
})
