import { describe, expect, it } from 'vitest'
import { regexEscapeString } from './regexEscapeString'

describe('regexEscapeString', () => {
  it('escapes correctly', () => {
    expect(regexEscapeString('[click](google.com)')).toBe('\\[click\\]\\(google\\.com\\)')
  })

  it('works when creating RegExp object', () => {
    expect(() => {
      new RegExp(regexEscapeString('[.^$()]*(wow)+'), 'g')
    }).not.toThrowError()
  })

  it('should escape special characters', () => {
    const str = '.*+?^${}()|[\\]'
    const expected = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\\\\\]'
    expect(regexEscapeString(str)).toBe(expected)
  })

  it('should return the same string if there are no special characters', () => {
    const str = 'abc123'
    expect(regexEscapeString(str)).toBe(str)
  })

  it('should handle empty strings', () => {
    const str = ''
    expect(regexEscapeString(str)).toBe(str)
  })

  it('should escape special characters in a string with alphanumeric characters', () => {
    const str = 'abc.*+?^${}()|[\\]123'
    const expected = 'abc\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\\\\\]123'
    expect(regexEscapeString(str)).toBe(expected)
  })
})
