import { strPrependLines } from './strPrependLines'
import { describe, expect, it } from 'vitest'

describe(strPrependLines.name, () => {
  it('should prepend each line of a string with the specified string', () => {
    const string = 'Hello\nWorld'
    const toPrepend = 'Testing'
    const expectedResult = 'TestingHello\nTestingWorld'
    const result = strPrependLines(string, toPrepend)
    expect(result).toBe(expectedResult)
  })

  it('should prepend each line of a string with an empty string if the toPrepend string is empty', () => {
    const string = 'Hello\nWorld'
    const toPrepend = ''
    const expectedResult = 'Hello\nWorld'
    const result = strPrependLines(string, toPrepend)
    expect(result).toBe(expectedResult)
  })

  it('should prepend each line of a string with multiple characters', () => {
    const string = 'Hello\nWorld'
    const toPrepend = 'Testing123'
    const expectedResult = 'Testing123Hello\nTesting123World'
    const result = strPrependLines(string, toPrepend)
    expect(result).toBe(expectedResult)
  })

  it('should handle Windows line endings (CRLF)', () => {
    const string = 'Hello\r\nWorld'
    const toPrepend = '- '
    const expectedResult = '- Hello\n- World'
    const result = strPrependLines(string, toPrepend)
    expect(result).toBe(expectedResult)
  })
})
