import { strTrimLinesRight } from './strTrimLinesRight'
import { describe, expect, it } from 'vitest'

describe('strTrimLinesRight', () => {
  it('trims all lines', () => {
    const str = ['list:', ' 1. some text  ', ' 2. some text\t', '   a. some text   ', '   b. some text'].join('\n')
    expect(strTrimLinesRight(str)).toBe(
      ['list:', ' 1. some text', ' 2. some text', '   a. some text', '   b. some text'].join('\n'),
    )
  })

  it('should trim trailing whitespace from each line in a string', () => {
    const input = 'Hello, world!   \nThis is a test.   \n   '
    const expected = 'Hello, world!\nThis is a test.\n'
    expect(strTrimLinesRight(input)).toBe(expected)
  })

  it('should return the same string if there is no trailing whitespace', () => {
    const input = 'Hello, world!\nThis is a test.\n'
    const expected = 'Hello, world!\nThis is a test.\n'
    expect(strTrimLinesRight(input)).toBe(expected)
  })

  it('should return an empty string if the input is an empty string', () => {
    const input = ''
    const expected = ''
    expect(strTrimLinesRight(input)).toBe(expected)
  })

  it('should handle a string with only whitespace', () => {
    const input = '   \n   \n   '
    const expected = '\n\n'
    expect(strTrimLinesRight(input)).toBe(expected)
  })

  it('should handle a string with no newline characters', () => {
    const input = 'Hello, world!   '
    const expected = 'Hello, world!'
    expect(strTrimLinesRight(input)).toBe(expected)
  })
})
