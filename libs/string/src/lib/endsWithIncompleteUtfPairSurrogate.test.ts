import { endsWithIncompleteUtfPairSurrogate } from './endsWithIncompleteUtfPairSurrogate'
import { describe, expect, it } from 'vitest'

describe('endsWithIncompleteUtfPairSurrogate', () => {
  const HIGH_SURROGATE_START = 55_296
  const HIGH_SURROGATE_END = 56_319

  it('should return false for an empty string', () => {
    expect(endsWithIncompleteUtfPairSurrogate('')).toBe(false)
  })

  it('should return false for a string that does not end with an incomplete UTF pair surrogate', () => {
    expect(endsWithIncompleteUtfPairSurrogate('Hello, world!')).toBe(false)
  })

  describe('boundary tests', () => {
    it('valid', () => {
      expect(endsWithIncompleteUtfPairSurrogate('abc' + String.fromCharCode(HIGH_SURROGATE_START))).toBe(true)
      expect(endsWithIncompleteUtfPairSurrogate('abc' + String.fromCharCode(HIGH_SURROGATE_START + 1))).toBe(true)
      expect(endsWithIncompleteUtfPairSurrogate('abc' + String.fromCharCode(HIGH_SURROGATE_END - 1))).toBe(true)
      expect(endsWithIncompleteUtfPairSurrogate('abc' + String.fromCharCode(HIGH_SURROGATE_END))).toBe(true)
    })
    it('invalid', () => {
      expect(endsWithIncompleteUtfPairSurrogate('abc' + String.fromCharCode(HIGH_SURROGATE_START - 1))).toBe(false)
      expect(endsWithIncompleteUtfPairSurrogate('abc' + String.fromCharCode(HIGH_SURROGATE_END + 1))).toBe(false)
    })
  })

  it('should return false for a string that ends with a complete UTF pair surrogate', () => {
    expect(endsWithIncompleteUtfPairSurrogate('Hello, world!😊🌍')).toBe(false)
  })
})
