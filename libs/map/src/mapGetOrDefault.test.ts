import { describe, expect, it, vitest } from 'vitest'
import { mapGetOrDefault } from './mapGetOrDefault'

describe(mapGetOrDefault.name, () => {
  it('should return the value for the key if it exists in the map', () => {
    const map = new Map()
    map.set('test', 1)
    const callback = vitest.fn()
    const result = mapGetOrDefault(map, 'test', callback)
    expect(result).toBe(1)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should call the callback and set the value in the map if the key does not exist', () => {
    const map = new Map()
    const callback = vitest.fn().mockReturnValue(2)
    const result = mapGetOrDefault(map, 'test', callback)
    expect(result).toBe(2)
    expect(callback).toHaveBeenCalledWith('test', map)
    expect(map.get('test')).toBe(2)
  })

  it('should handle edge case where map is empty', () => {
    const map = new Map()
    const callback = vitest.fn().mockReturnValue(3)
    const result = mapGetOrDefault(map, 'test', callback)
    expect(result).toBe(3)
    expect(callback).toHaveBeenCalledWith('test', map)
    expect(map.get('test')).toBe(3)
  })

  it('should handle edge case where callback returns undefined', () => {
    const map = new Map()
    const callback = vitest.fn().mockReturnValue(undefined)
    const result = mapGetOrDefault(map, 'test', callback)
    expect(result).toBeUndefined()
    expect(callback).toHaveBeenCalledWith('test', map)
    expect(map.get('test')).toBeUndefined()
  })

  describe('GenericMap overload', () => {
    class MyMap<K, V> {
      private map = new Map<K, V>()
      get(key: K): V | undefined {
        return this.map.get(key)
      }
      set(key: K, value: V) {
        this.map.set(key, value)
        return this
      }
      has(key: K): boolean {
        return this.map.has(key)
      }
    }
    it('should return existing value', () => {
      const map = new MyMap<string, number>()
      map.set('x', 123)
      const callback = vitest.fn()
      expect(mapGetOrDefault(map, 'x', callback)).toBe(123)
      expect(callback).not.toHaveBeenCalled()
    })
    it('should set and return value if key is missing', () => {
      const map = new MyMap<string, number>()
      const callback = vitest.fn().mockReturnValue(456)
      expect(mapGetOrDefault(map, 'y', callback)).toBe(456)
      expect(callback).toHaveBeenCalledWith('y', map)
      expect(map.get('y')).toBe(456)
    })
  })

  describe('WeakMap overload', () => {
    it('should return existing value', () => {
      const key = {}
      const map = new WeakMap<object, number>([[key, 55]])
      const callback = vitest.fn()
      expect(mapGetOrDefault(map, key, callback)).toBe(55)
      expect(callback).not.toHaveBeenCalled()
    })
    it('should set and return value if key is missing', () => {
      const key = {}
      const map = new WeakMap<object, number>()
      const callback = vitest.fn().mockReturnValue(88)
      expect(mapGetOrDefault(map, key, callback)).toBe(88)
      expect(callback).toHaveBeenCalledWith(key, map)
      // WeakMap does not expose keys, so we can't check value directly
    })
    it('should handle callback returning undefined', () => {
      const key = {}
      const map = new WeakMap<object, number>()
      const callback = vitest.fn().mockReturnValue(undefined)
      expect(mapGetOrDefault(map, key, callback)).toBeUndefined()
      expect(callback).toHaveBeenCalledWith(key, map)
    })
  })
})
