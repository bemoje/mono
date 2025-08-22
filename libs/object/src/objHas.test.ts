import { describe, expect, it } from 'vitest'

import { objHas } from './objHas'

describe('objHas function', () => {
  it('should return true if the object has the key', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(objHas(obj, 'a')).toBe(true)
  })

  it('should return false if the object does not have the key', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(objHas(obj, 'd')).toBe(false)
  })

  it('should return true if the object has the key with undefined value', () => {
    const obj = { a: undefined, b: 2, c: 3 }
    expect(objHas(obj, 'a')).toBe(true)
  })

  it('should return false for an empty object', () => {
    const obj = {}
    expect(objHas(obj, 'a')).toBe(false)
  })
})
