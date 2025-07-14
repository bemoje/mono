import { strParseBoolean } from './strParseBoolean'
import { describe, expect, it } from 'vitest'

describe('strParseBoolean', () => {
  it('should return true when given "true"', () => {
    expect(strParseBoolean('true')).toBe(true)
  })

  it('should return false when given "false"', () => {
    expect(strParseBoolean('false')).toBe(false)
  })

  it('should return false when given any other string', () => {
    expect(strParseBoolean('hello')).toBe(false)
    expect(strParseBoolean('123')).toBe(false)
    expect(strParseBoolean('')).toBe(false)
  })

  it('should return true when the input string is "true" (case insensitive)', () => {
    expect(strParseBoolean('true')).toBe(true)
    expect(strParseBoolean('True')).toBe(true)
    expect(strParseBoolean('TRUE')).toBe(true)
    expect(strParseBoolean('tRuE')).toBe(true)
  })

  it('should return false when the input string is not "true" (case insensitive)', () => {
    expect(strParseBoolean('false')).toBe(false)
    expect(strParseBoolean('False')).toBe(false)
    expect(strParseBoolean('FALSE')).toBe(false)
    expect(strParseBoolean('fAlSe')).toBe(false)
  })

  it('should return false when the input string is not a boolean string', () => {
    expect(strParseBoolean('random')).toBe(false)
    expect(strParseBoolean('123')).toBe(false)
    expect(strParseBoolean('')).toBe(false)
  })

  it('should return false when the input string is a boolean string with leading or trailing spaces', () => {
    expect(strParseBoolean(' true ')).toBe(true)
    expect(strParseBoolean(' false ')).toBe(false)
  })
})
