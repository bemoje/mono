import { createLteValidator } from './createLteValidator'
import { describe, expect, it } from 'vitest'

describe(createLteValidator.name, () => {
  it('should create a validator with correct name', () => {
    const isLte5 = createLteValidator(5)
    expect(isLte5.name).toBe('isLte5')

    const isLte0 = createLteValidator(0)
    expect(isLte0.name).toBe('isLte0')

    const isLteNeg10 = createLteValidator(-10)
    expect(isLteNeg10.name).toBe('isLte-10')
  })

  describe('validator function behavior', () => {
    const isLte5 = createLteValidator(5)

    it('should return true for values less than or equal to limit', () => {
      expect(isLte5(5)).toBe(true)
      expect(isLte5(4)).toBe(true)
      expect(isLte5(0)).toBe(true)
      expect(isLte5(-1)).toBe(true)
      expect(isLte5(4.9)).toBe(true)
    })

    it('should return false for values greater than limit', () => {
      expect(isLte5(6)).toBe(false)
      expect(isLte5(100)).toBe(false)
      expect(isLte5(5.1)).toBe(false)
    })

    it('should return false for non-number values', () => {
      expect(isLte5('5')).toBe(false)
      expect(isLte5('4')).toBe(false)
      expect(isLte5(null)).toBe(false)
      expect(isLte5(undefined)).toBe(false)
      expect(isLte5({})).toBe(false)
      expect(isLte5([])).toBe(false)
      expect(isLte5(true)).toBe(false)
    })

    it('should return false for NaN and Infinity', () => {
      expect(isLte5(NaN)).toBe(false)
      expect(isLte5(Infinity)).toBe(false)
      expect(isLte5(-Infinity)).toBe(false)
    })
  })
})
