import { isDigits } from './isDigits'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isDigits.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isDigits('123'), true)
      assert.strictEqual(isDigits('0'), true)
      assert.strictEqual(isDigits('abc'), false)
      assert.strictEqual(isDigits(''), false)
    }).not.toThrow()
  })

  describe('valid digit strings', () => {
    it('should return true for strings of digits', () => {
      expect(isDigits('0')).toBe(true)
      expect(isDigits('1')).toBe(true)
      expect(isDigits('9')).toBe(true)
      expect(isDigits('123')).toBe(true)
      expect(isDigits('456789')).toBe(true)
      expect(isDigits('0000')).toBe(true)
      expect(isDigits('1234567890')).toBe(true)
    })
  })

  describe('invalid strings', () => {
    it('should return false for empty string', () => {
      expect(isDigits('')).toBe(false)
    })

    it('should return false for strings with non-digit characters', () => {
      expect(isDigits('a')).toBe(false)
      expect(isDigits('abc')).toBe(false)
      expect(isDigits('123a')).toBe(false)
      expect(isDigits('a123')).toBe(false)
      expect(isDigits('12a34')).toBe(false)
      expect(isDigits('12 34')).toBe(false)
      expect(isDigits('12.34')).toBe(false)
      expect(isDigits('12-34')).toBe(false)
      expect(isDigits('12+34')).toBe(false)
      expect(isDigits('-123')).toBe(false)
      expect(isDigits('+123')).toBe(false)
    })

    it('should return false for strings with whitespace', () => {
      expect(isDigits(' ')).toBe(false)
      expect(isDigits(' 123')).toBe(false)
      expect(isDigits('123 ')).toBe(false)
      expect(isDigits(' 123 ')).toBe(false)
      expect(isDigits('1 2 3')).toBe(false)
    })

    it('should return false for strings with special characters', () => {
      expect(isDigits('!')).toBe(false)
      expect(isDigits('@#$')).toBe(false)
      expect(isDigits('123!')).toBe(false)
      expect(isDigits('12\n34')).toBe(false)
      expect(isDigits('12\t34')).toBe(false)
    })
  })
})
