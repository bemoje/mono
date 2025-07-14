import { strNoConsecutiveWhitespace } from './strNoConsecutiveWhitespace'
import { describe, expect, it } from 'vitest'

describe('strNoConsecutiveWhitespace', () => {
  it('should replace consecutive whitespace characters with a single space', () => {
    const result = strNoConsecutiveWhitespace('Hello   World')
    expect(result).toBe('Hello World')
  })

  it('should handle strings with no consecutive whitespace', () => {
    const result = strNoConsecutiveWhitespace('Hello World')
    expect(result).toBe('Hello World')
  })

  it('should handle strings with only whitespace', () => {
    const result = strNoConsecutiveWhitespace('     ')
    expect(result).toBe(' ')
  })

  it('should handle empty strings', () => {
    const result = strNoConsecutiveWhitespace('')
    expect(result).toBe('')
  })

  it('should handle strings with whitespace at the start and end', () => {
    const result = strNoConsecutiveWhitespace('  Hello World  ')
    expect(result).toBe(' Hello World ')
  })

  it('should handle strings with multiple consecutive whitespace in between words', () => {
    const result = strNoConsecutiveWhitespace('Hello   World   How   Are   You')
    expect(result).toBe('Hello World How Are You')
  })
})
