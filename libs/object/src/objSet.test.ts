import { describe, expect, it } from 'vitest'

import { Any } from '@mono/types'
import { objSet } from './objSet'

describe('objSet', () => {
  it('should set a value for a key in an object and return the value', () => {
    const obj: Any = {}
    const key: Any = 'testKey'
    const value = 'testValue'
    const result = objSet(obj, key, value)
    expect(result).toBe(value)
    expect(obj[key]).toBe(value)
  })

  it('should overwrite an existing value for a key in an object and return the new value', () => {
    const obj: Any = { testKey: 'oldValue' }
    const key: Any = 'testKey'
    const value = 'newValue'
    const result = objSet(obj, key, value)
    expect(result).toBe(value)
    expect(obj[key]).toBe(value)
  })

  it('should handle numeric keys', () => {
    const obj: Any = {}
    const key: Any = 123
    const value = 'testValue'
    const result = objSet(obj, key, value)
    expect(result).toBe(value)
    expect(obj[key]).toBe(value)
  })

  it('should handle symbol keys', () => {
    const obj: Any = {}
    const key: Any = Symbol('testSymbol')
    const value = 'testValue'
    const result = objSet(obj, key, value)
    expect(result).toBe(value)
    expect(obj[key]).toBe(value)
  })
})
