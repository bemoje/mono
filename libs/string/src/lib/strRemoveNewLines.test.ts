import { strRemoveNewLines } from './strRemoveNewLines'
import { describe, expect, it } from 'vitest'

describe('strRemoveNewLines', () => {
  it('should remove all new line characters from a string', () => {
    const input = 'Hello\nWorld'
    const expected = 'HelloWorld'
    expect(strRemoveNewLines(input)).toBe(expected)
  })

  it('should replace new line characters with a provided string', () => {
    const input = 'Hello\nWorld'
    const replaceWith = ' '
    const expected = 'Hello World'
    expect(strRemoveNewLines(input, replaceWith)).toBe(expected)
  })

  it('should return the original string if there are no new line characters', () => {
    const input = 'Hello World'
    const expected = 'Hello World'
    expect(strRemoveNewLines(input)).toBe(expected)
  })

  it('should handle empty strings', () => {
    const input = ''
    const expected = ''
    expect(strRemoveNewLines(input)).toBe(expected)
  })

  it('should handle strings with only new line characters', () => {
    const input = '\n\n\n'
    const replaceWith = ' '
    const expected = '   '
    expect(strRemoveNewLines(input, replaceWith)).toBe(expected)
  })

  it('should handle strings with carriage return and new line characters', () => {
    const input = 'Hello\r\nWorld'
    const expected = 'HelloWorld'
    expect(strRemoveNewLines(input)).toBe(expected)
  })
})
