import { strTrimLinesLeft } from './strTrimLinesLeft'
import { describe, expect, it } from 'vitest'

describe('strTrimLinesLeft', () => {
  it('trims all lines', () => {
    const str = ['list:', ' 1. some text', ' 2. some text', '   a. some text', '   b. some text'].join('\n')
    expect(strTrimLinesLeft(str)).toBe(
      ['list:', '1. some text', '2. some text', 'a. some text', 'b. some text'].join('\n'),
    )
  })

  it('should trim leading whitespace from each line in a string', () => {
    const input = '  line1\n  line2\n  line3'
    const expected = 'line1\nline2\nline3'
    expect(strTrimLinesLeft(input)).toBe(expected)
  })

  it('should handle string with no leading whitespace', () => {
    const input = 'line1\nline2\nline3'
    const expected = 'line1\nline2\nline3'
    expect(strTrimLinesLeft(input)).toBe(expected)
  })

  it('should handle string with no newlines', () => {
    const input = '  line1'
    const expected = 'line1'
    expect(strTrimLinesLeft(input)).toBe(expected)
  })

  it('should handle empty string', () => {
    const input = ''
    const expected = ''
    expect(strTrimLinesLeft(input)).toBe(expected)
  })

  it('should handle string with only whitespace', () => {
    const input = '  \n  \n  '
    const expected = '\n\n'
    expect(strTrimLinesLeft(input)).toBe(expected)
  })

  it('should handle string with carriage return and newline', () => {
    const input = '  line1\r\n  line2\r\n  line3'
    const expected = 'line1\nline2\nline3'
    expect(strTrimLinesLeft(input)).toBe(expected)
  })
})
