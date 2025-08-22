import { strToCharSet } from './strToCharSet'
import { describe, expect, it } from 'vitest'

describe('strToCharSet', () => {
  it('should return a set of unique characters from a string', () => {
    const result = strToCharSet('hello')
    expect(result).toEqual(new Set(['h', 'e', 'l', 'o']))
  })

  it('should return an empty set for an empty string', () => {
    const result = strToCharSet('')
    expect(result).toEqual(new Set())
  })

  it('should handle strings with duplicate characters', () => {
    const result = strToCharSet('aabbcc')
    expect(result).toEqual(new Set(['a', 'b', 'c']))
  })

  it('should handle strings with special characters', () => {
    const result = strToCharSet('!@#$%^&*()')
    expect(result).toEqual(new Set(['!', '@', '#', '$', '%', '^', '&', '*', '(', ')']))
  })

  it('should handle strings with numbers', () => {
    const result = strToCharSet('1234567890')
    expect(result).toEqual(new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']))
  })
})
