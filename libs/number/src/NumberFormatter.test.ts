import { NumberFormatter } from './NumberFormatter'
import { describe, expect, it } from 'vitest'

describe('NumberFormatter', () => {
  describe('format', () => {
    const formatter = new NumberFormatter()

    it('should format a positive number with thousand seperator and decimal seperator', () => {
      expect(formatter.format(1234567.89)).toBe('1,234,567.89')
    })

    it('should format a negative number with thousand seperator and decimal seperator', () => {
      expect(formatter.format(-1234567.89)).toBe('-1,234,567.89')
    })

    it('should format a number with custom thousand seperator and decimal seperator', () => {
      formatter.thousandSeparator = '-'
      formatter.decimalSeparator = '.'
      expect(formatter.format(1234567.89)).toBe('1-234-567.89')
    })

    it('should format a number with custom thousand seperator and decimal seperator and no decimals', () => {
      formatter.thousandSeparator = '-'
      formatter.decimalSeparator = '.'
      formatter.precision = 0
      expect(formatter.format(1234567.89)).toBe('1-234-568')
    })

    it('should format a number with custom thousand seperator and decimal seperator and more decimals than input has', () => {
      formatter.thousandSeparator = '-'
      formatter.decimalSeparator = '.'
      formatter.precision = 5
      expect(formatter.format(1234567.89)).toBe('1-234-567.89000')
    })
  })

  describe('Locales', () => {
    it('static getLocales', () => {
      expect([...NumberFormatter.getLocales().entries()]).toEqual([
        ['en-US', [',', '.']],
        ['da-DK', ['.', ',']],
      ])
    })

    it('should  not throw on valid locale', () => {
      expect(() => {
        new NumberFormatter().locale('en-US')
      }).not.toThrow()
    })

    it('should throw on invalid locale', () => {
      expect(() => {
        new NumberFormatter().locale('test')
      }).toThrow()
    })

    it('should define a new locale', () => {
      NumberFormatter.defineLocale('test', 'a', 'b')
      const o = new NumberFormatter().locale('test')
      expect(o.thousandSeparator).toBe('a')
      expect(o.decimalSeparator).toBe('b')
      expect(() => {
        new NumberFormatter().locale('test')
      }).not.toThrow()
    })

    const formatter = new NumberFormatter()

    const parseAndFormat = (string: string) => {
      return expect(formatter.format(formatter.parse(string))).toBe(string)
    }

    it('da-DK', () => {
      formatter.locale('da-DK')
      formatter.precision = 0
      parseAndFormat('5')
      parseAndFormat('5')
      parseAndFormat('5.000')
      parseAndFormat('25.000')
      parseAndFormat('5.000.000')
      parseAndFormat('-5.000')
      parseAndFormat('5.001')
      formatter.precision = 1
      parseAndFormat('5.000,5')
      formatter.precision = 3
      parseAndFormat('5.000,512')
      formatter.precision = 5
      parseAndFormat('5.000,51200')
    })

    it('en-US', () => {
      formatter.locale('en-US')
      formatter.precision = 0
      parseAndFormat('5')
      parseAndFormat('5')
      parseAndFormat('5,000')
      parseAndFormat('25,000')
      parseAndFormat('5,000,000')
      parseAndFormat('-5,000')
      parseAndFormat('5,001')
      formatter.precision = 1
      parseAndFormat('5,000.5')
      formatter.precision = 3
      parseAndFormat('5,000.512')
      formatter.precision = 5
      parseAndFormat('5,000.51200')
    })
  })
})
