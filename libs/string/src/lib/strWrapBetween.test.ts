import { strWrapBetween } from './strWrapBetween'
import { describe, expect, it } from 'vitest'

describe('strWrapBetween', () => {
  it('example', () => {
    expect(strWrapBetween('input', '#', '&')).toBe('#input&')
  })

  it('should wrap a string between two other strings', () => {
    expect(strWrapBetween('Hello', '[', ']')).toBe('[Hello]')
  })

  it('should return the input string if left and right strings are empty', () => {
    expect(strWrapBetween('Hello', '', '')).toBe('Hello')
  })

  it('should return the input string wrapped with left string if right string is empty', () => {
    expect(strWrapBetween('Hello', '[', '')).toBe('[Hello')
  })

  it('should return the input string wrapped with right string if left string is empty', () => {
    expect(strWrapBetween('Hello', '', ']')).toBe('Hello]')
  })

  it('should handle special characters in the input, left and right strings', () => {
    expect(strWrapBetween('Hello', '/*', '*/')).toBe('/*Hello*/')
  })

  it('should handle empty input string', () => {
    expect(strWrapBetween('', '[', ']')).toBe('[]')
  })
})
