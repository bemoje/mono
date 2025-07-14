import { strReplaceAll } from './strReplaceAll'
import { describe, expect, it } from 'vitest'

describe('strReplaceAll', () => {
  it('replaces original string when nothing matches', () => {
    expect(strReplaceAll('wow', 'i', 'o')).toBe('wow')
  })

  it('replaces single occurance', () => {
    expect(strReplaceAll('wow', 'o', 'oo')).toBe('woow')
  })

  it('replaces multiple occurances', () => {
    expect(strReplaceAll('this, is, some, text', ', ', ';')).toBe('this;is;some;text')
  })

  it('accepts regex flags', () => {
    expect(strReplaceAll('wow', 'O', 'oo', 'gi')).toBe('woow')
  })

  it('regex-escapes input string', () => {
    expect(strReplaceAll('func(3)', '(3)', '(4)')).toBe('func(4)')
  })

  it('should replace all occurrences of a substring in a string with a specified replacement', () => {
    const result = strReplaceAll('Hello world, world', 'world', 'Earth')
    expect(result).toBe('Hello Earth, Earth')
  })

  it('should return the original string if the substring to be replaced is not found', () => {
    const result = strReplaceAll('Hello world', 'Earth', 'world')
    expect(result).toBe('Hello world')
  })

  it('should replace all occurrences of a substring in a string with an empty string', () => {
    const result = strReplaceAll('Hello world, world', 'world', '')
    expect(result).toBe('Hello , ')
  })

  it('should return the original string if the replacement string is the same as the substring to be replaced', () => {
    const result = strReplaceAll('Hello world, world', 'world', 'world')
    expect(result).toBe('Hello world, world')
  })

  it('should replace all occurrences of a substring in a string with a specified replacement using custom flags', () => {
    const result = strReplaceAll('Hello World, world', 'world', 'Earth', 'gi')
    expect(result).toBe('Hello Earth, Earth')
  })

  it('should return the original string if the input string is empty', () => {
    const result = strReplaceAll('', 'world', 'Earth')
    expect(result).toBe('')
  })

  it('should return the original string if the substring to be replaced is empty', () => {
    const result = strReplaceAll('Hello world, world', '', 'Earth')
    expect(result).toBe('Hello world, world')
  })

  it('should replace all occurrences of a substring in a string with a specified replacement if the replacement string is empty and the flags are custom', () => {
    const result = strReplaceAll('Hello World, world', 'world', '', 'gi')
    expect(result).toBe('Hello , ')
  })
})
