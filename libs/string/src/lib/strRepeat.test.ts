import { strRepeat } from './strRepeat'
import { describe, expect, it } from 'vitest'

describe('strRepeat', () => {
  it('zero', () => {
    expect(strRepeat('a', 0)).toBe('')
  })

  it('single', () => {
    expect(strRepeat('a', 1)).toBe('a')
  })

  it('double', () => {
    expect(strRepeat('a', 2)).toBe('aa')
  })

  it('tripple', () => {
    expect(strRepeat('a', 3)).toBe('aaa')
  })

  it('should repeat the string n times', () => {
    expect(strRepeat('abc', 3)).toBe('abcabcabc')
  })

  it('should return an empty string if n is 0', () => {
    expect(strRepeat('abc', 0)).toBe('')
  })

  it('should return an empty string if the input string is empty', () => {
    expect(strRepeat('', 5)).toBe('')
  })

  it('should handle single character strings', () => {
    expect(strRepeat('a', 5)).toBe('aaaaa')
  })

  it('should throw an error if n is negative', () => {
    expect(() => strRepeat('abc', -1)).toThrow()
  })

  it('should throw an error if n is not an integer', () => {
    expect(() => strRepeat('abc', 1.5)).toThrow()
  })
})
