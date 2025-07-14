import { strRemoveEmptyLines } from './strRemoveEmptyLines'
import { describe, expect, it } from 'vitest'

describe('strRemoveEmptyLines', () => {
  it('removes all lines that are empty or only contain whitespace', () => {
    const str = [
      '',
      'list:',
      ' 1. some text',
      ' 2. some text',
      '',
      '\t\t ',
      '   a. some text',
      '   b. some text',
      '',
      ' ',
    ].join('\n')
    expect(strRemoveEmptyLines(str)).toBe(
      ['list:', ' 1. some text', ' 2. some text', '   a. some text', '   b. some text'].join('\n'),
    )
  })

  it('should remove all empty lines from a given string', () => {
    const input = 'Hello\n\n\nWorld\n\n!'
    const expected = 'Hello\nWorld\n!'
    expect(strRemoveEmptyLines(input)).toBe(expected)
  })

  it('should return an empty string if the input is an empty string', () => {
    const input = ''
    const expected = ''
    expect(strRemoveEmptyLines(input)).toBe(expected)
  })

  it('should handle strings with only empty lines', () => {
    const input = '\n\n\n\n'
    const expected = ''
    expect(strRemoveEmptyLines(input)).toBe(expected)
  })

  it('should handle strings with spaces on the empty lines', () => {
    const input = 'Hello\n \nWorld\n \n'
    const expected = 'Hello\nWorld'
    expect(strRemoveEmptyLines(input)).toBe(expected)
  })

  it('should handle strings with carriage return and newline characters', () => {
    const input = 'Hello\r\n\r\nWorld\r\n\r\n'
    const expected = 'Hello\nWorld'
    expect(strRemoveEmptyLines(input)).toBe(expected)
  })
})
