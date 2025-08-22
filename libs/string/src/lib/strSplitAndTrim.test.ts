import { strSplitAndTrim } from './strSplitAndTrim'
import { describe, expect, it } from 'vitest'

describe('strSplitAndTrim', () => {
  it('should split the string by the specified delimiter and trim each resulting substring', () => {
    const result = strSplitAndTrim('  hello world  ,  foo bar  ', ',')
    expect(result).toEqual(['hello world', 'foo bar'])
  })

  it('should remove empty lines if removeEmptyLines is true', () => {
    const result = strSplitAndTrim('  hello world  ,  foo bar  ,  ', ',', true)
    expect(result).toEqual(['hello world', 'foo bar'])
  })

  it('should not remove empty lines if removeEmptyLines is false', () => {
    const result = strSplitAndTrim('  hello world  ,  foo bar  ,  ', ',', false)
    expect(result).toEqual(['hello world', 'foo bar', ''])
  })

  it('should handle string without the specified delimiter', () => {
    const result = strSplitAndTrim('  hello world  ', ',')
    expect(result).toEqual(['hello world'])
  })

  it('should handle empty string', () => {
    const result = strSplitAndTrim('', ',')
    expect(result).toEqual([''])
  })

  it('should handle string with only delimiters', () => {
    const result = strSplitAndTrim(',,,,', ',')
    expect(result).toEqual(['', '', '', '', ''])
  })

  it('should handle string with only delimiters and removeEmptyLines is true', () => {
    const result = strSplitAndTrim(',,,,', ',', true)
    expect(result).toEqual([])
  })
})
