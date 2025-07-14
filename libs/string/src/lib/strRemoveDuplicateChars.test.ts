import { strRemoveDuplicateChars } from './strRemoveDuplicateChars'
import { describe, expect, it } from 'vitest'

describe('strRemoveDuplicateChars', () => {
  it('should remove duplicate characters from a string', () => {
    expect(strRemoveDuplicateChars('Hello world!')).toEqual('Helo wrd!')
    expect(strRemoveDuplicateChars('Hello')).toEqual('Helo')
    expect(strRemoveDuplicateChars('')).toEqual('')
  })

  it('should remove duplicate characters from a string', () => {
    const result = strRemoveDuplicateChars('hello')
    expect(result).toBe('helo')
  })

  it('should return the same string if there are no duplicate characters', () => {
    const result = strRemoveDuplicateChars('world')
    expect(result).toBe('world')
  })

  it('should return an empty string if the input is an empty string', () => {
    const result = strRemoveDuplicateChars('')
    expect(result).toBe('')
  })

  it('should handle strings with all the same character', () => {
    const result = strRemoveDuplicateChars('aaaaa')
    expect(result).toBe('a')
  })

  it('should handle strings with special characters', () => {
    const result = strRemoveDuplicateChars('!@#$%^&*()')
    expect(result).toBe('!@#$%^&*()')
  })

  it('should handle strings with duplicate special characters', () => {
    const result = strRemoveDuplicateChars('!!@@##$$%%^^&&**(())')
    expect(result).toBe('!@#$%^&*()')
  })

  it('should handle strings with mixed case', () => {
    const result = strRemoveDuplicateChars('HelloWorld')
    expect(result).toBe('HeloWrd')
  })

  it('should handle strings with duplicate mixed case characters', () => {
    const result = strRemoveDuplicateChars('HelloWorldHelloWorld')
    expect(result).toBe('HeloWrd')
  })
})
