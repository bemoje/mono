import { describe, it, expect } from 'vitest'
import { isExtValid } from './isExtValid'

describe(isExtValid.name, () => {
  it('should return true for valid file extensions', () => {
    expect(isExtValid('.txt')).toBe(true)
    expect(isExtValid('.jpg')).toBe(true)
    expect(isExtValid('.pdf')).toBe(true)
    expect(isExtValid('txt')).toBe(true)
    expect(isExtValid('jpg')).toBe(true)
    expect(isExtValid('pdf')).toBe(true)
  })

  it('should return false for empty file extension', () => {
    expect(isExtValid('')).toBe(false)
  })

  it('should return false for a period', () => {
    expect(isExtValid('.')).toBe(false)
  })

  it('should return false for invalid file extensions', () => {
    expect(isExtValid('.a<a')).toBe(false)
    expect(isExtValid('.a>a')).toBe(false)
    expect(isExtValid('.a"a')).toBe(false)
    expect(isExtValid('.a|a')).toBe(false)
    expect(isExtValid('.a?a')).toBe(false)
    expect(isExtValid('.a<a')).toBe(false)
    expect(isExtValid('.a*a')).toBe(false)
    expect(isExtValid('.a:a')).toBe(false)
  })
})
