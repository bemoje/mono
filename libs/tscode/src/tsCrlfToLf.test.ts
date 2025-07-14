import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { tsCrlfToLf } from './tsCrlfToLf'

describe(tsCrlfToLf.name, () => {
  it('examples', () => {
    expect(() => {
      // CRLF to LF conversion
      const crlfCode = "const foo = 'bar'\r\nconst baz = 'qux'"
      const result1 = tsCrlfToLf(crlfCode)
      assert.strictEqual(result1, "const foo = 'bar'\nconst baz = 'qux'")

      // LF already - no change
      const lfCode = "const foo = 'bar'\nconst baz = 'qux'"
      const result2 = tsCrlfToLf(lfCode)
      assert.strictEqual(result2, lfCode)

      // No line endings
      const singleLine = "const foo = 'bar'"
      const result3 = tsCrlfToLf(singleLine)
      assert.strictEqual(result3, singleLine)
    }).not.toThrow()
  })

  describe('CRLF conversion', () => {
    it('should convert CRLF to LF', () => {
      const input = 'line1\r\nline2\r\nline3'
      const expected = 'line1\nline2\nline3'
      expect(tsCrlfToLf(input)).toBe(expected)
    })

    it('should handle multiple CRLF sequences', () => {
      const input = 'line1\r\n\r\nline2\r\nline3\r\n'
      const expected = 'line1\n\nline2\nline3\n'
      expect(tsCrlfToLf(input)).toBe(expected)
    })
  })

  describe('LF preservation', () => {
    it('should leave LF unchanged', () => {
      const input = 'line1\nline2\nline3'
      expect(tsCrlfToLf(input)).toBe(input)
    })

    it('should handle mixed line endings', () => {
      const input = 'line1\r\nline2\nline3\r\n'
      const expected = 'line1\nline2\nline3\n'
      expect(tsCrlfToLf(input)).toBe(expected)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(tsCrlfToLf('')).toBe('')
    })

    it('should handle string without line endings', () => {
      const input = 'single line'
      expect(tsCrlfToLf(input)).toBe(input)
    })

    it('should handle only CRLF', () => {
      expect(tsCrlfToLf('\r\n')).toBe('\n')
    })
  })
})
