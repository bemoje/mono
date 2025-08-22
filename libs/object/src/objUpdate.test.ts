import { objUpdate } from './objUpdate'
import { describe, expect, it } from 'vitest'

describe('objUpdate', () => {
  type CB = (value: number | undefined, key: PropertyKey) => number
  const callback: CB = (value, key) => (value ? value * 2 : 0)

  it('should update the value of a specific key in an object', () => {
    const obj = { a: 1, b: 2 }
    const key = 'a'
    const result = objUpdate(obj, key, callback)
    expect(result).toBe(2)
    expect(obj).toEqual({ a: 2, b: 2 })
  })

  it('should handle undefined values', () => {
    const obj = { a: undefined, b: 2 }
    const key = 'a'
    const result = objUpdate(obj, key, callback)
    expect(result).toBe(0)
    expect(obj).toEqual({ a: 0, b: 2 })
  })

  it('should handle non-existing keys', () => {
    const obj: Record<string, number> = { a: 1, b: 2 }
    const key = 'c'
    const result = objUpdate(obj, key, callback)
    expect(result).toBe(0)
    expect(obj).toEqual({ a: 1, b: 2, c: 0 })
  })

  it('should handle symbol keys', () => {
    const key = Symbol('key')
    const obj = { [key]: 1, b: 2 }
    const result = objUpdate(obj, key, callback)
    expect(result).toBe(2)
    expect(obj).toEqual({ [key]: 2, b: 2 })
  })
})
