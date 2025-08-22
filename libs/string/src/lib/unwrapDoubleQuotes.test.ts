import { describe, expect, it } from 'vitest'
import { unwrapDoubleQuotes } from './unwrapDoubleQuotes'

describe(unwrapDoubleQuotes.name, () => {
  it('should remove double quotes from the beginning and end of a string', () => {
    const input = '"Hello, World!"'
    const expectedOutput = 'Hello, World!'
    const result = unwrapDoubleQuotes(input)
    expect(result).toBe(expectedOutput)
  })

  it('should not remove double quotes from the middle of a string', () => {
    const input = 'Hello, "World!"'
    const expectedOutput = 'Hello, "World!"'
    const result = unwrapDoubleQuotes(input)
    expect(result).toBe(expectedOutput)
  })

  it('should not remove double quotes if the string does not start or end with double quotes', () => {
    const input = 'Hello, World!'
    const expectedOutput = 'Hello, World!'
    const result = unwrapDoubleQuotes(input)
    expect(result).toBe(expectedOutput)
  })
})
