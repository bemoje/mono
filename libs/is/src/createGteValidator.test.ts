import { createGteValidator } from './createGteValidator'
import { describe, expect, it } from 'vitest'

describe(createGteValidator.name, () => {
  it('should create a validator with correct name', () => {
    const isGte5 = createGteValidator(5)
    expect(isGte5.name).toBe('isGte5')

    const isGte0 = createGteValidator(0)
    expect(isGte0.name).toBe('isGte0')

    const isGteNeg10 = createGteValidator(-10)
    expect(isGteNeg10.name).toBe('isGte-10')
  })

  describe('validator function behavior', () => {
    const isGte5 = createGteValidator(5)

    it('should return true for values greater than or equal to limit', () => {
      expect(isGte5(5)).toBe(true)
      expect(isGte5(6)).toBe(true)
      expect(isGte5(100)).toBe(true)
      expect(isGte5(5.1)).toBe(true)
    })

    it('should return false for values less than limit', () => {
      expect(isGte5(4)).toBe(false)
      expect(isGte5(0)).toBe(false)
      expect(isGte5(-1)).toBe(false)
      expect(isGte5(4.9)).toBe(false)
    })

    it('should return false for non-number values', () => {
      expect(isGte5('5')).toBe(false)
      expect(isGte5('10')).toBe(false)
      expect(isGte5(null)).toBe(false)
      expect(isGte5(undefined)).toBe(false)
      expect(isGte5({})).toBe(false)
      expect(isGte5([])).toBe(false)
      expect(isGte5(true)).toBe(false)
    })

    it('should return false for NaN and Infinity', () => {
      expect(isGte5(NaN)).toBe(false)
      expect(isGte5(Infinity)).toBe(false)
      expect(isGte5(-Infinity)).toBe(false)
    })
  })
})
