import { strWrapInSingleQuotes } from './strWrapInSingleQuotes'
import { describe, expect, it } from 'vitest'

describe('strWrapInSingleQuotes', () => {
  it('example', () => {
    expect(strWrapInSingleQuotes('input')).toBe("'input'")
  })

  it('should wrap a string in single quotes', () => {
    const input = 'test'
    const expectedOutput = "'test'"
    expect(strWrapInSingleQuotes(input)).toBe(expectedOutput)
  })

  it('should return single quotes if the input is an empty string', () => {
    const input = ''
    const expectedOutput = "''"
    expect(strWrapInSingleQuotes(input)).toBe(expectedOutput)
  })

  it('should handle strings with special characters', () => {
    const input = 'test$#%&*()'
    const expectedOutput = "'test$#%&*()'"
    expect(strWrapInSingleQuotes(input)).toBe(expectedOutput)
  })

  it('should handle strings with single quotes', () => {
    const input = "test'test"
    const expectedOutput = "'test'test'"
    expect(strWrapInSingleQuotes(input)).toBe(expectedOutput)
  })
})
