import { isHex } from './isHex'
import { describe, expect, it } from 'vitest'

describe('isHex', () => {
  it('should return true for valid hexadecimal numbers', () => {
    expect(isHex('a')).toBe(true)
    expect(isHex('A')).toBe(true)
    expect(isHex('0')).toBe(true)
    expect(isHex('f')).toBe(true)
    expect(isHex('F')).toBe(true)
    expect(isHex('10')).toBe(true)
    expect(isHex('FF')).toBe(true)
    expect(isHex('123abc')).toBe(true)
    expect(isHex('abcdef')).toBe(true)
    expect(isHex('ABCDEF')).toBe(true)
    expect(isHex('1234567890abcdef')).toBe(true)
    expect(isHex('1234567890ABCDEF')).toBe(true)
  })

  it('should return false for invalid hexadecimal numbers', () => {
    expect(isHex('g')).toBe(false)
    expect(isHex('G')).toBe(false)
    expect(isHex('z')).toBe(false)
    expect(isHex('Z')).toBe(false)
    expect(isHex('!')).toBe(false)
    expect(isHex('@')).toBe(false)
    expect(isHex('#')).toBe(false)
    expect(isHex('$')).toBe(false)
    expect(isHex('%')).toBe(false)
    expect(isHex('^')).toBe(false)
    expect(isHex('&')).toBe(false)
    expect(isHex('*')).toBe(false)
    expect(isHex('(')).toBe(false)
    expect(isHex(')')).toBe(false)
    expect(isHex('-')).toBe(false)
    expect(isHex('+')).toBe(false)
    expect(isHex('=')).toBe(false)
    expect(isHex('abcdefg')).toBe(false)
    expect(isHex('ABCDEFG')).toBe(false)
    expect(isHex('1234567890abcdefg')).toBe(false)
    expect(isHex('1234567890ABCDEFG')).toBe(false)
  })

  it('should return false for empty strings', () => {
    expect(isHex('')).toBe(false)
  })

  it('should return false for strings with spaces', () => {
    expect(isHex(' ')).toBe(false)
    expect(isHex('  ')).toBe(false)
    expect(isHex(' a')).toBe(false)
    expect(isHex('a ')).toBe(false)
    expect(isHex(' a ')).toBe(false)
    expect(isHex('123 abc')).toBe(false)
    expect(isHex('123abc ')).toBe(false)
    expect(isHex(' 123abc')).toBe(false)
    expect(isHex(' 123abc ')).toBe(false)
  })
})
