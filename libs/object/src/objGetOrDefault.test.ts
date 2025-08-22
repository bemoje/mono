/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vitest } from 'vitest'
import { objGetOrDefault } from './objGetOrDefault'

describe(objGetOrDefault.name, () => {
  describe('object overload', () => {
    it('should return existing value', () => {
      const obj = { foo: 42 }
      const callback = vitest.fn()
      expect(objGetOrDefault(obj, 'foo', callback)).toBe(42)
      expect(callback).not.toHaveBeenCalled()
    })
    it('should set and return value if key is missing', () => {
      const obj: Record<string, number> = {}
      const callback = vitest.fn().mockReturnValue(99)
      expect(objGetOrDefault(obj, 'bar', callback)).toBe(99)
      expect(obj.bar).toBe(99)
      expect(callback).toHaveBeenCalledWith('bar')
    })
    it('should handle undefined value', () => {
      const obj = {} as any
      const callback = vitest.fn().mockReturnValue(123)
      expect(objGetOrDefault(obj, 'foo', callback)).toBe(123)
      expect(obj.foo).toBe(123)
    })
  })

  it('should work with numeric object keys', () => {
    const obj: Record<number, string> = {}
    const callback = vitest.fn().mockReturnValue('num')
    expect(objGetOrDefault(obj, 42, callback)).toBe('num')
    expect(obj[42]).toBe('num')
  })

  it('should work with symbol keys in objects', () => {
    const sym = Symbol('s')
    const obj: Record<symbol, string> = {} as never
    const callback = vitest.fn().mockReturnValue('sym')
    expect(objGetOrDefault(obj, sym, callback)).toBe('sym')
    expect(obj[sym]).toBe('sym')
  })
})
