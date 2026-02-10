import { describe, expect, it } from 'vitest'
import { isGenericMap } from './isGenericMap'

describe(isGenericMap.name, () => {
  it('should return true for a native Map', () => {
    expect(isGenericMap(new Map())).toBe(true)
  })

  it('should return true for an object implementing Map interface', () => {
    const fakeMap = {
      get: () => undefined,
      set: () => fakeMap,
      has: () => false,
    }
    expect(isGenericMap(fakeMap)).toBe(true)
  })

  it('should return false for a plain object', () => {
    expect(isGenericMap({})).toBe(false)
  })

  it('should return false for null', () => {
    expect(isGenericMap(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isGenericMap(undefined)).toBe(false)
  })

  it('should return false for a string', () => {
    expect(isGenericMap('not a map')).toBe(false)
  })

  it('should check custom required props', () => {
    const partial = { get: () => undefined }
    expect(isGenericMap(partial, ['get'])).toBe(true)
    expect(isGenericMap(partial, ['get', 'set'])).toBe(false)
  })
})
