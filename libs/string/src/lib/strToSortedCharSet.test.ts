import { strToSortedCharSet } from './strToSortedCharSet'
import { describe, expect, it } from 'vitest'

describe('strToSortedCharSet', () => {
  it('should return a string containing the set of all unique characters in a string', () => {
    expect(strToSortedCharSet('hello')).toBe('ehlo')
    expect(strToSortedCharSet('world')).toBe('dlorw')
    expect(strToSortedCharSet('')).toBe('')
  })
})
