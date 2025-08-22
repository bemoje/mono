import { strSortChars } from './strSortChars'
import { describe, expect, it } from 'vitest'

describe('strSortChars', () => {
  it('should sort the characters in a string', () => {
    expect(strSortChars('hello')).toBe('ehllo')
    expect(strSortChars('world')).toBe('dlorw')
    expect(strSortChars('')).toBe('')
  })

  it('should sort the characters in a string in alphabetical order', () => {
    expect(strSortChars('dcba')).toBe('abcd')
  })

  it('should handle uppercase and lowercase letters', () => {
    expect(strSortChars('DcBa')).toBe('BDac')
  })

  it('should handle special characters', () => {
    expect(strSortChars('d$cba')).toBe('$abcd')
  })

  it('should handle numbers', () => {
    expect(strSortChars('d3c2b1a0')).toBe('0123abcd')
  })

  it('should handle empty strings', () => {
    expect(strSortChars('')).toBe('')
  })

  it('should handle strings with one character', () => {
    expect(strSortChars('a')).toBe('a')
  })

  it('should handle strings with same characters', () => {
    expect(strSortChars('aaaa')).toBe('aaaa')
  })
})
