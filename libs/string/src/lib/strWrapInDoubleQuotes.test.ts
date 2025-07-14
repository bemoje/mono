import { strWrapInDoubleQuotes } from './strWrapInDoubleQuotes'
import { describe, expect, it } from 'vitest'

describe('strWrapInDoubleQuotes', () => {
  it('example', () => {
    expect(strWrapInDoubleQuotes('input')).toBe('"input"')
  })

  it('should wrap a string in double quotes', () => {
    const input = 'Hello, World!'
    const expectedOutput = '"Hello, World!"'
    expect(strWrapInDoubleQuotes(input)).toBe(expectedOutput)
  })

  it('should return an empty string wrapped in double quotes when input is an empty string', () => {
    const input = ''
    const expectedOutput = '""'
    expect(strWrapInDoubleQuotes(input)).toBe(expectedOutput)
  })

  it('should wrap a string containing double quotes in double quotes', () => {
    const input = 'He said, "Hello, World!"'
    const expectedOutput = '"He said, "Hello, World!""'
    expect(strWrapInDoubleQuotes(input)).toBe(expectedOutput)
  })
})
