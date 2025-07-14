import { strIsLowerCase } from './strIsLowerCase'
import { describe, expect, it } from 'vitest'

describe('strIsLowerCase', () => {
  it('example', () => {
    expect(strIsLowerCase('input')).toBe(true)
    expect(strIsLowerCase('Input')).toBe(false)
    expect(strIsLowerCase('')).toBe(true)
    expect(strIsLowerCase('.')).toBe(true)
  })

  it('should return true for a lowercase string', () => {
    expect(strIsLowerCase('hello')).toBe(true)
  })

  it('should return false for an uppercase string', () => {
    expect(strIsLowerCase('HELLO')).toBe(false)
  })

  it('should return false for a mixed case string', () => {
    expect(strIsLowerCase('Hello')).toBe(false)
  })

  it('should return true for an empty string', () => {
    expect(strIsLowerCase('')).toBe(true)
  })

  it('should return true for a string with spaces', () => {
    expect(strIsLowerCase('hello world')).toBe(true)
  })

  it('should return false for a string with spaces and uppercase letters', () => {
    expect(strIsLowerCase('Hello World')).toBe(false)
  })

  it('should return true for a string with special characters', () => {
    expect(strIsLowerCase('hello@world.com')).toBe(true)
  })

  it('should return false for a string with special characters and uppercase letters', () => {
    expect(strIsLowerCase('Hello@World.com')).toBe(false)
  })
})
