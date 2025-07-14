import { strRemoveFirstAndLastLine } from './strRemoveFirstAndLastLine'
import { describe, expect, it } from 'vitest'

describe('strRemoveFirstAndLastLine', () => {
  it('should remove the first and last line from a multi-line string', () => {
    const input = 'First line\nSecond line\nThird line'
    const expected = 'Second line'
    expect(strRemoveFirstAndLastLine(input)).toBe(expected)
  })

  it('should return an empty string if the input string only has one line', () => {
    const input = 'Only one line'
    const expected = ''
    expect(strRemoveFirstAndLastLine(input)).toBe(expected)
  })

  it('should return an empty string if the input string has two lines', () => {
    const input = 'First line\nSecond line'
    const expected = ''
    expect(strRemoveFirstAndLastLine(input)).toBe(expected)
  })

  it('should handle an empty string', () => {
    const input = ''
    const expected = ''
    expect(strRemoveFirstAndLastLine(input)).toBe(expected)
  })

  it('should handle a string with only newlines', () => {
    const input = '\n\n\n'
    const expected = '\n'
    expect(strRemoveFirstAndLastLine(input)).toBe(expected)
  })
})
