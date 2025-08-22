import { strIsUpperCase } from './strIsUpperCase'
import { describe, expect, it } from 'vitest'

describe('strIsUpperCase', () => {
  it('example', () => {
    expect(strIsUpperCase('INPUT')).toBe(true)
    expect(strIsUpperCase('Input')).toBe(false)
  })

  it('should return true for a string in upper case', () => {
    expect(strIsUpperCase('HELLO')).toBe(true)
  })

  it('should return false for a string in lower case', () => {
    expect(strIsUpperCase('hello')).toBe(false)
  })

  it('should return false for a string in mixed case', () => {
    expect(strIsUpperCase('Hello')).toBe(false)
  })

  it('should return true for a string with upper case special characters', () => {
    expect(strIsUpperCase('HELLO WORLD!')).toBe(true)
  })

  it('should return false for a string with lower case special characters', () => {
    expect(strIsUpperCase('hello world!')).toBe(false)
  })

  it('should return true for an empty string', () => {
    expect(strIsUpperCase('')).toBe(true)
  })

  it('should return true for a string with only spaces', () => {
    expect(strIsUpperCase('   ')).toBe(true)
  })

  it('should return true for a string with numbers', () => {
    expect(strIsUpperCase('123')).toBe(true)
  })

  it('should return true for a string with upper case numbers and special characters', () => {
    expect(strIsUpperCase('HELLO123!')).toBe(true)
  })

  it('should return false for a string with lower case numbers and special characters', () => {
    expect(strIsUpperCase('hello123!')).toBe(false)
  })
})
