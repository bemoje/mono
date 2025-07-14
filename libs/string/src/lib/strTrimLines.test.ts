import { strTrimLines } from './strTrimLines'
import { describe, expect, it } from 'vitest'

describe('strTrimLines', () => {
  it('should trim leading and trailing whitespace from each line in a string', () => {
    const input = '  Hello, World!  \n  This is a test.  '
    const expected = 'Hello, World!\nThis is a test.'
    expect(strTrimLines(input)).toBe(expected)
  })

  it('should return the same string if there is no leading or trailing whitespace', () => {
    const input = 'Hello, World!\nThis is a test.'
    const expected = 'Hello, World!\nThis is a test.'
    expect(strTrimLines(input)).toBe(expected)
  })

  it('should return an empty string if the input is an empty string', () => {
    const input = ''
    const expected = ''
    expect(strTrimLines(input)).toBe(expected)
  })

  it('should return a string with no spaces if the input is a string of spaces', () => {
    const input = '     \n     '
    const expected = '\n'
    expect(strTrimLines(input)).toBe(expected)
  })

  it('should handle a string with only one line', () => {
    const input = '  Hello, World!  '
    const expected = 'Hello, World!'
    expect(strTrimLines(input)).toBe(expected)
  })

  it('should handle a string with multiple lines and no spaces', () => {
    const input = 'Hello,\nWorld!'
    const expected = 'Hello,\nWorld!'
    expect(strTrimLines(input)).toBe(expected)
  })
})
