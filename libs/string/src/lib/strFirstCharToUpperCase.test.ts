import { strFirstCharToUpperCase } from './strFirstCharToUpperCase'
import { describe, expect, it } from 'vitest'

describe('strFirstCharToUpperCase', () => {
  it('should convert the first character of a string to uppercase', () => {
    const result = strFirstCharToUpperCase('hello')
    expect(result).toBe('Hello')
  })

  it('should return the same string if the first character is already uppercase', () => {
    const result = strFirstCharToUpperCase('Hello')
    expect(result).toBe('Hello')
  })

  it('should return the same string if it starts with a non-alphabetical character', () => {
    const result = strFirstCharToUpperCase('1hello')
    expect(result).toBe('1hello')
  })

  it('should return an empty string if the input is an empty string', () => {
    const result = strFirstCharToUpperCase('')
    expect(result).toBe('')
  })

  it('should handle strings with only one character', () => {
    const result = strFirstCharToUpperCase('h')
    expect(result).toBe('H')
  })

  it('should handle strings with only one uppercase character', () => {
    const result = strFirstCharToUpperCase('H')
    expect(result).toBe('H')
  })
})
