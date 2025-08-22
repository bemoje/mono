import { strCountChars } from './strCountChars'
import { describe, expect, it } from 'vitest'

describe('strCountChars', () => {
  it('should count the number of occurrences of each character in a string', () => {
    expect(strCountChars('Hello world!')).toEqual(
      new Map([
        ['H', 1],
        ['e', 1],
        ['l', 3],
        ['o', 2],
        [' ', 1],
        ['w', 1],
        ['r', 1],
        ['d', 1],
        ['!', 1],
      ]),
    )
    expect(strCountChars('Hello')).toEqual(
      new Map([
        ['H', 1],
        ['e', 1],
        ['l', 2],
        ['o', 1],
      ]),
    )
    expect(strCountChars('')).toEqual(new Map())
  })

  it('should return a Map with character counts for a non-empty string', () => {
    const result = strCountChars('hello')
    expect(result.get('h')).toBe(1)
    expect(result.get('e')).toBe(1)
    expect(result.get('l')).toBe(2)
    expect(result.get('o')).toBe(1)
  })

  it('should return an empty Map for an empty string', () => {
    const result = strCountChars('')
    expect(result.size).toBe(0)
  })

  it('should correctly count characters in a string with multiple same characters', () => {
    const result = strCountChars('aaaaa')
    expect(result.get('a')).toBe(5)
  })

  it('should correctly count characters in a string with different characters', () => {
    const result = strCountChars('abcde')
    expect(result.get('a')).toBe(1)
    expect(result.get('b')).toBe(1)
    expect(result.get('c')).toBe(1)
    expect(result.get('d')).toBe(1)
    expect(result.get('e')).toBe(1)
  })

  it('should correctly count characters in a string with special characters', () => {
    const result = strCountChars('a!@#$%^&*()')
    expect(result.get('a')).toBe(1)
    expect(result.get('!')).toBe(1)
    expect(result.get('@')).toBe(1)
    expect(result.get('#')).toBe(1)
    expect(result.get('$')).toBe(1)
    expect(result.get('%')).toBe(1)
    expect(result.get('^')).toBe(1)
    expect(result.get('&')).toBe(1)
    expect(result.get('*')).toBe(1)
    expect(result.get('(')).toBe(1)
    expect(result.get(')')).toBe(1)
  })

  it('should correctly count characters in a string with spaces', () => {
    const result = strCountChars('a b c d e')
    expect(result.get('a')).toBe(1)
    expect(result.get(' ')).toBe(4)
    expect(result.get('b')).toBe(1)
    expect(result.get('c')).toBe(1)
    expect(result.get('d')).toBe(1)
    expect(result.get('e')).toBe(1)
  })
})
