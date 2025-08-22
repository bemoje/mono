import { strToCharCodes } from './strToCharCodes'
import { describe, expect, it } from 'vitest'

describe('strToCharCodes', () => {
  it('should convert a string to an array of char codes', () => {
    expect(strToCharCodes('hello')).toEqual([104, 101, 108, 108, 111])
    expect(strToCharCodes('world')).toEqual([119, 111, 114, 108, 100])
    expect(strToCharCodes('')).toEqual([])
  })

  it('should return an array of character codes for a given string', () => {
    const result = strToCharCodes('abc')
    expect(result).toEqual([97, 98, 99])
  })

  it('should return an empty array for an empty string', () => {
    const result = strToCharCodes('')
    expect(result).toEqual([])
  })

  it('should handle strings with special characters', () => {
    const result = strToCharCodes('!@#')
    expect(result).toEqual([33, 64, 35])
  })

  it('should handle strings with unicode characters', () => {
    const result = strToCharCodes('😀')
    expect(result).toEqual([128512, 56832])
  })

  it('should handle strings with numbers', () => {
    const result = strToCharCodes('123')
    expect(result).toEqual([49, 50, 51])
  })
})
