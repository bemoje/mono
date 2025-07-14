import { isDefined } from './isDefined'
import { describe, expect, it } from 'vitest'

describe(isDefined.name, () => {
  it('should return true if value is defined', () => {
    expect(isDefined(5)).toBe(true)
    expect(isDefined('hello')).toBe(true)
    expect(isDefined({ name: 'John' })).toBe(true)
  })

  it('should return false if value is undefined', () => {
    expect(isDefined(undefined)).toBe(false)
  })

  it('should return true if value is null', () => {
    expect(isDefined(null)).toBe(true)
  })

  it('should return true if value is empty string', () => {
    expect(isDefined('')).toBe(true)
  })
})
