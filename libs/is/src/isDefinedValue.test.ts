import { isDefinedValue } from './isDefinedValue'
import { describe, expect, it } from 'vitest'

describe(isDefinedValue.name, () => {
  it('should return true if value is defined', () => {
    expect(isDefinedValue(5)).toBe(true)
    expect(isDefinedValue('hello')).toBe(true)
    expect(isDefinedValue({ name: 'John' })).toBe(true)
  })

  it('should return false if value is undefined', () => {
    expect(isDefinedValue(undefined)).toBe(false)
  })

  it('should return false if value is null', () => {
    expect(isDefinedValue(null)).toBe(false)
  })

  it('should return true if value is empty string', () => {
    expect(isDefinedValue('')).toBe(true)
  })
})
