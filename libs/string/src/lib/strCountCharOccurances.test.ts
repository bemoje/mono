import { strCountCharOccurances } from './strCountCharOccurances'
import { describe, expect, it } from 'vitest'

describe('strCountCharOccurances', () => {
  it('works with empty string', () => {
    expect(strCountCharOccurances('', 'a')).toBe(0)
  })

  it('works with one match', () => {
    expect(strCountCharOccurances('hi all', 'a')).toBe(1)
  })

  it('works with multiple matches', () => {
    expect(strCountCharOccurances('hello world', 'l')).toBe(3)
  })

  it('should count the number of occurrences of a specific character in a string', () => {
    expect(strCountCharOccurances('hello world', 'l')).toBe(3)
    expect(strCountCharOccurances('hello world', 'o')).toBe(2)
    expect(strCountCharOccurances('hello world', 'h')).toBe(1)
  })

  it('should return 0 if the character does not exist in the string', () => {
    expect(strCountCharOccurances('hello world', 'z')).toBe(0)
  })

  it('should throw an error if the char parameter is not a single character string of length 1', () => {
    expect(() => strCountCharOccurances('hello world', 'hello')).toThrow(
      'Expected char to be a single character string of length 1.',
    )
    expect(() => strCountCharOccurances('hello world', '')).toThrow(
      'Expected char to be a single character string of length 1.',
    )
  })

  it('should handle empty string input', () => {
    expect(strCountCharOccurances('', 'a')).toBe(0)
  })

  it('should handle case sensitivity', () => {
    expect(strCountCharOccurances('Hello World', 'h')).toBe(0)
    expect(strCountCharOccurances('Hello World', 'H')).toBe(1)
  })
})
