import { strWrapIn } from './strWrapIn'
import { describe, expect, it } from 'vitest'

describe('strWrapIn', () => {
  it('example', () => {
    expect(strWrapIn('input', '#')).toBe('#input#')
  })

  it('should wrap the input string with the wrap string', () => {
    const result = strWrapIn('Hello', '*')
    expect(result).toBe('*Hello*')
  })

  it('should return the input string wrapped with multiple characters', () => {
    const result = strWrapIn('Hello', '***')
    expect(result).toBe('***Hello***')
  })

  it('should return the input string wrapped with an empty string', () => {
    const result = strWrapIn('Hello', '')
    expect(result).toBe('Hello')
  })

  it('should return an empty string when the input string is empty', () => {
    const result = strWrapIn('', '*')
    expect(result).toBe('**')
  })

  it('should return the wrap string twice when the input string is empty', () => {
    const result = strWrapIn('', '***')
    expect(result).toBe('******')
  })
})
