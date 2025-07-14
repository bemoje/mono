import { determineNumberLocale } from './determineNumberLocale'
import { describe, expect, it } from 'vitest'

describe(determineNumberLocale.name, () => {
  describe('indistinguishable', () => {
    it('should return undefined for positive integers', () => {
      expect(determineNumberLocale(['0'])).toBeUndefined()
      expect(determineNumberLocale(['1'])).toBeUndefined()
      expect(determineNumberLocale(['10'])).toBeUndefined()
      expect(determineNumberLocale(['100'])).toBeUndefined()
      expect(determineNumberLocale(['1000'])).toBeUndefined()
      expect(determineNumberLocale(['10000'])).toBeUndefined()
      expect(determineNumberLocale(['100000'])).toBeUndefined()
      expect(determineNumberLocale(['1000000'])).toBeUndefined()
    })

    it('should return undefined for negative integers', () => {
      expect(determineNumberLocale(['-0'])).toBeUndefined()
      expect(determineNumberLocale(['-1'])).toBeUndefined()
      expect(determineNumberLocale(['-10'])).toBeUndefined()
      expect(determineNumberLocale(['-100'])).toBeUndefined()
      expect(determineNumberLocale(['-1000'])).toBeUndefined()
      expect(determineNumberLocale(['-10000'])).toBeUndefined()
      expect(determineNumberLocale(['-100000'])).toBeUndefined()
      expect(determineNumberLocale(['-1000000'])).toBeUndefined()
    })

    it('should return undefined for integers with single thousand separator', () => {
      expect(determineNumberLocale(['1.000'])).toBeUndefined()
      expect(determineNumberLocale(['1,000'])).toBeUndefined()
      expect(determineNumberLocale(['10.000'])).toBeUndefined()
      expect(determineNumberLocale(['10,000'])).toBeUndefined()
      expect(determineNumberLocale(['100.000'])).toBeUndefined()
      expect(determineNumberLocale(['100,000'])).toBeUndefined()
    })

    it('should return undefined for some decimal numbers with three decimal digits with configurations that make them identical to some numbers of the other locale', () => {
      expect(determineNumberLocale(['0,001'])).toBeUndefined()
      expect(determineNumberLocale(['0.001'])).toBeUndefined()
      expect(determineNumberLocale(['1,001'])).toBeUndefined()
      expect(determineNumberLocale(['1.001'])).toBeUndefined()
      expect(determineNumberLocale(['10,001'])).toBeUndefined()
      expect(determineNumberLocale(['10.001'])).toBeUndefined()
      expect(determineNumberLocale(['100,001'])).toBeUndefined()
      expect(determineNumberLocale(['100.001'])).toBeUndefined()
    })
  })

  describe('distinguishable', () => {
    describe('da', () => {
      it('should distinguish any decimal numbers that do not have three decimal digits', () => {
        expect(determineNumberLocale(['0,1'])).toBe('da')
        expect(determineNumberLocale(['0,01'])).toBe('da')
        expect(determineNumberLocale(['0,0001'])).toBe('da')
        expect(determineNumberLocale(['0,00'])).toBe('da')
        expect(determineNumberLocale(['1,00'])).toBe('da')
        expect(determineNumberLocale(['10,00'])).toBe('da')
        expect(determineNumberLocale(['100,00'])).toBe('da')
        expect(determineNumberLocale(['1.000,00'])).toBe('da')
        expect(determineNumberLocale(['10.000,00'])).toBe('da')
        expect(determineNumberLocale(['100.000,00'])).toBe('da')
        expect(determineNumberLocale(['1.000.000,00'])).toBe('da')
      })

      it('should distinguish decimal numbers with missing thousand separators', () => {
        expect(determineNumberLocale(['1000,01'])).toBe('da')
        expect(determineNumberLocale(['10000,01'])).toBe('da')
        expect(determineNumberLocale(['100000,01'])).toBe('da')
        expect(determineNumberLocale(['1000000,01'])).toBe('da')
      })

      it('should distinguish integers with multiple thousand separators', () => {
        expect(determineNumberLocale(['1.000.000'])).toBe('da')
        expect(determineNumberLocale(['1.000.000.000'])).toBe('da')
      })

      it('should distinguish decimal numbers with implicit initial zero that do not have three decimal digits', () => {
        expect(determineNumberLocale([',1'])).toBe('da')
        expect(determineNumberLocale([',01'])).toBe('da')
        expect(determineNumberLocale([',0001'])).toBe('da')
      })
    })

    describe('en', () => {
      it('should distinguish any decimal numbers that do not have three decimal digits', () => {
        expect(determineNumberLocale(['0.1'])).toBe('en')
        expect(determineNumberLocale(['0.01'])).toBe('en')
        expect(determineNumberLocale(['0.0001'])).toBe('en')
        expect(determineNumberLocale(['0.00'])).toBe('en')
        expect(determineNumberLocale(['1.00'])).toBe('en')
        expect(determineNumberLocale(['10.00'])).toBe('en')
        expect(determineNumberLocale(['100.00'])).toBe('en')
        expect(determineNumberLocale(['1,000.00'])).toBe('en')
        expect(determineNumberLocale(['10,000.00'])).toBe('en')
        expect(determineNumberLocale(['100,000.00'])).toBe('en')
        expect(determineNumberLocale(['1,000,000.00'])).toBe('en')
      })

      it('should distinguish decimal numbers with missing thousand separators', () => {
        expect(determineNumberLocale(['1000.01'])).toBe('en')
        expect(determineNumberLocale(['10000.01'])).toBe('en')
        expect(determineNumberLocale(['100000.01'])).toBe('en')
        expect(determineNumberLocale(['1000000.01'])).toBe('en')
      })

      it('should distinguish integers with multiple thousand separators', () => {
        expect(determineNumberLocale(['1,000,000'])).toBe('en')
        expect(determineNumberLocale(['1,000,000,000'])).toBe('en')
      })

      it('should distinguish decimal numbers with implicit initial zero that do not have three decimal digits', () => {
        expect(determineNumberLocale(['.1'])).toBe('en')
        expect(determineNumberLocale(['.01'])).toBe('en')
        expect(determineNumberLocale(['.0001'])).toBe('en')
      })
    })
  })
})
