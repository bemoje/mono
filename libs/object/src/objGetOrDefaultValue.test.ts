import { describe, expect, it } from 'vitest'

import { objGetOrDefaultValue } from './objGetOrDefaultValue'

describe('objGetOrDefaultValue', () => {
  it('should return the value associated with the key if it exists', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const key = 'b'
    const result = objGetOrDefaultValue(obj, key, 4)
    expect(result).toBe(2)
  })

  it('should add the key-value pair to the object if the value is undefined', () => {
    type T = Record<string, number | undefined>
    const obj: T = { a: 1, b: 2, c: 3, d: undefined }
    const key = 'd'
    objGetOrDefaultValue(obj, key, 4)
    expect(obj).toHaveProperty(key, 4)
  })

  it('should handle symbol keys', () => {
    const key = Symbol('key')
    const obj: Record<symbol, number> = { [key]: 2 }
    const result = objGetOrDefaultValue(obj, key, 4)
    expect(result).toBe(2)
  })

  it('should handle number keys', () => {
    const obj: Record<number, number> = { 1: 1, 2: 2, 3: 3 }
    const key = 2
    const result = objGetOrDefaultValue(obj, key, 4)
    expect(result).toBe(2)
  })
})
