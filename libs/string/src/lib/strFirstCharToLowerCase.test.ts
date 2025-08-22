import { strFirstCharToLowerCase } from './strFirstCharToLowerCase'
import { describe, expect, it } from 'vitest'

describe('strFirstCharToLowerCase', () => {
  it('should convert the first character of a string to lowercase', () => {
    const result = strFirstCharToLowerCase('Hello')
    expect(result).toBe('hello')
  })

  it('should return the same string if the first character is already lowercase', () => {
    const result = strFirstCharToLowerCase('hello')
    expect(result).toBe('hello')
  })

  it('should return the same string if it starts with a non-alphabetical character', () => {
    const result = strFirstCharToLowerCase('1hello')
    expect(result).toBe('1hello')
  })

  it('should return an empty string if the input is an empty string', () => {
    const result = strFirstCharToLowerCase('')
    expect(result).toBe('')
  })

  it('should handle strings with only one character', () => {
    const result = strFirstCharToLowerCase('H')
    expect(result).toBe('h')
  })

  it('should handle strings with only one lowercase character', () => {
    const result = strFirstCharToLowerCase('h')
    expect(result).toBe('h')
  })
})
