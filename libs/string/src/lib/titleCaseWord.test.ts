import { titleCaseWord } from './titleCaseWord'
import { describe, expect, it } from 'vitest'

describe(titleCaseWord.name, () => {
  it('should capitalize the first character and lowercase the rest of a single word', () => {
    expect(titleCaseWord('hello')).toBe('Hello')
    expect(titleCaseWord('WORLD')).toBe('World')
  })

  it('should handle single-character words correctly', () => {
    expect(titleCaseWord('a')).toBe('A')
    expect(titleCaseWord('B')).toBe('B')
  })

  it('should return an empty string when provided an empty string', () => {
    expect(titleCaseWord('')).toBe('')
  })

  it('should handle words with mixed casing', () => {
    expect(titleCaseWord('tEsT')).toBe('Test')
  })

  it('should not alter non-alphabetic characters at the start of the word', () => {
    expect(titleCaseWord('1word')).toBe('1word')
    expect(titleCaseWord('@test')).toBe('@test')
  })

  it('should correctly process words with only uppercase letters', () => {
    expect(titleCaseWord('TEST')).toBe('Test')
  })

  it('should correctly process words with only lowercase letters', () => {
    expect(titleCaseWord('test')).toBe('Test')
  })
})
