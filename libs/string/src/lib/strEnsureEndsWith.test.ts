import { strEnsureEndsWith } from './strEnsureEndsWith'
import { describe, expect, it } from 'vitest'

describe('strEnsureEndsWith', () => {
  it('should return the original string if it already ends with the specified substring', () => {
    const result = strEnsureEndsWith('Hello, world!', 'world!')
    expect(result).toBe('Hello, world!')
  })

  it('should append the specified substring to the end of the string if it does not already end with it', () => {
    const result = strEnsureEndsWith('Hello, world', '!')
    expect(result).toBe('Hello, world!')
  })

  it('should append the specified substring to the end of the string if the string is empty', () => {
    const result = strEnsureEndsWith('', 'Hello, world!')
    expect(result).toBe('Hello, world!')
  })

  it('should return the original string if the specified substring is empty', () => {
    const result = strEnsureEndsWith('Hello, world!', '')
    expect(result).toBe('Hello, world!')
  })

  it('should return the specified substring if both the string and the substring are empty', () => {
    const result = strEnsureEndsWith('', '')
    expect(result).toBe('')
  })
})
