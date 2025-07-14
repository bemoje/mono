import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import { TimeoutWeakMap } from './TimeoutWeakMap'

describe(TimeoutWeakMap.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('examples', () => {
    expect(() => {
      // Basic usage with automatic timeout
      const cache = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      // Set and get values
      cache.set(key, 'hello')
      assert.strictEqual(cache.get(key), 'hello')
      assert.strictEqual(cache.has(key), true)

      // Values expire after timeout
      vi.advanceTimersByTime(1000)
      assert.strictEqual(cache.has(key), false)
      assert.strictEqual(cache.get(key), undefined)

      // Custom timeout per entry
      const key2 = {}
      cache.set(key2, 'world', 2000)
      vi.advanceTimersByTime(1000)
      assert.strictEqual(cache.has(key2), true) // Still exists after 1s
      vi.advanceTimersByTime(1000)
      assert.strictEqual(cache.has(key2), false) // Expired after 2s

      // Factory pattern with getOrDefault
      const key3 = {}
      const value = cache.getOrDefault(key3, () => 'created')
      assert.strictEqual(value, 'created')
      assert.strictEqual(cache.get(key3), 'created')

      // Update existing values
      cache.update(key3, (old) => old + ' and updated')
      assert.strictEqual(cache.get(key3), 'created and updated')

      // Load multiple entries
      const entries: [object, string][] = [
        [{}, 'a'],
        [{}, 'b'],
      ]
      cache.load(entries)
      assert.strictEqual(cache.get(entries[0][0]), 'a')
      assert.strictEqual(cache.get(entries[1][0]), 'b')
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should create instance with default timeout', () => {
      const map = new TimeoutWeakMap<object, string>(5000)
      expect(map.timeoutMs).toBe(5000)
    })
  })

  describe(TimeoutWeakMap.prototype.set.name, () => {
    it('should set value with default timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      const result = map.set(key, 'test')

      expect(result).toBe(map) // Returns this for chaining
      expect(map.has(key)).toBe(true)
      expect(map.get(key)).toBe('test')
    })

    it('should set value with custom timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'test', 2000)

      // Should not expire after default timeout
      vi.advanceTimersByTime(1000)
      expect(map.has(key)).toBe(true)

      // Should expire after custom timeout
      vi.advanceTimersByTime(1000)
      expect(map.has(key)).toBe(false)
    })

    it('should replace existing entry and clear old timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'first')
      map.set(key, 'second')

      expect(map.get(key)).toBe('second')

      // Should still expire after timeout
      vi.advanceTimersByTime(1000)
      expect(map.has(key)).toBe(false)
    })

    it('should use unref() on timeout to not prevent process exit', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}
      const unrefSpy = vi.spyOn(global, 'setTimeout').mockImplementation(((callback: () => void) => {
        const timeout = {
          unref: vi.fn().mockReturnThis(),
          refresh: vi.fn(),
        }
        return timeout as any
      }) as any)

      map.set(key, 'test')

      expect(unrefSpy).toHaveBeenCalled()
      const timeoutObject = unrefSpy.mock.results[0].value
      expect(timeoutObject.unref).toHaveBeenCalled()
    })
  })

  describe(TimeoutWeakMap.prototype.get.name, () => {
    it('should return undefined for non-existent key', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      expect(map.get(key)).toBeUndefined()
    })

    it('should return value and refresh timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}
      const refreshSpy = vi.fn()

      // Mock setTimeout to capture the timeout object
      vi.spyOn(global, 'setTimeout').mockImplementation(((callback: () => void) => {
        const timeout = {
          unref: vi.fn().mockReturnThis(),
          refresh: refreshSpy,
        }
        return timeout as any
      }) as any)

      map.set(key, 'test')
      refreshSpy.mockClear() // Clear the call from set()

      const result = map.get(key)

      expect(result).toBe('test')
      expect(refreshSpy).toHaveBeenCalled()
    })

    it('should return undefined for expired entry', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'test')
      vi.advanceTimersByTime(1000)

      expect(map.get(key)).toBeUndefined()
    })
  })

  describe(TimeoutWeakMap.prototype.delete.name, () => {
    it('should return false for non-existent key', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      expect(map.delete(key)).toBe(false)
    })

    it('should delete existing entry and clear timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      map.set(key, 'test')
      const result = map.delete(key)

      expect(result).toBe(true)
      expect(map.has(key)).toBe(false)
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })

    it('should handle multiple deletes gracefully', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'test')
      expect(map.delete(key)).toBe(true)
      expect(map.delete(key)).toBe(false) // Second delete returns false
    })
  })

  describe(TimeoutWeakMap.prototype.has.name, () => {
    it('should return false for non-existent key', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      expect(map.has(key)).toBe(false)
    })

    it('should return true for existing key', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'test')
      expect(map.has(key)).toBe(true)
    })

    it('should return false for expired key', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'test')
      vi.advanceTimersByTime(1000)
      expect(map.has(key)).toBe(false)
    })

    it('should not refresh timeout like get() does', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}
      const refreshSpy = vi.fn()

      // Mock setTimeout to capture the timeout object
      vi.spyOn(global, 'setTimeout').mockImplementation(((callback: () => void) => {
        const timeout = {
          unref: vi.fn().mockReturnThis(),
          refresh: refreshSpy,
        }
        return timeout as any
      }) as any)

      map.set(key, 'test')
      refreshSpy.mockClear()

      map.has(key)

      expect(refreshSpy).not.toHaveBeenCalled()
    })
  })

  describe(TimeoutWeakMap.prototype.load.name, () => {
    it('should load multiple entries with default timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const entries: [object, string][] = [
        [{}, 'first'],
        [{}, 'second'],
        [{}, 'third'],
      ]

      const result = map.load(entries)

      expect(result).toBe(map) // Returns this for chaining
      entries.forEach(([key, value]) => {
        expect(map.get(key)).toBe(value)
      })
    })

    it('should load multiple entries with custom timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const entries: [object, string][] = [
        [{}, 'first'],
        [{}, 'second'],
      ]

      map.load(entries, 2000)

      // Should not expire after default timeout
      vi.advanceTimersByTime(1000)
      entries.forEach(([key]) => {
        expect(map.has(key)).toBe(true)
      })

      // Should expire after custom timeout
      vi.advanceTimersByTime(1000)
      entries.forEach(([key]) => {
        expect(map.has(key)).toBe(false)
      })
    })

    it('should handle empty iterable', () => {
      const map = new TimeoutWeakMap<object, string>(1000)

      expect(() => map.load([])).not.toThrow()
    })
  })

  describe(TimeoutWeakMap.prototype.update.name, () => {
    it('should update existing value', () => {
      const map = new TimeoutWeakMap<object, number>(1000)
      const key = {}

      map.set(key, 5)
      const result = map.update(key, (value) => (value ?? 0) + 10)

      expect(result).toBe(map) // Returns this for chaining
      expect(map.get(key)).toBe(15)
    })

    it('should create new value when key does not exist', () => {
      const map = new TimeoutWeakMap<object, number>(1000)
      const key = {}

      map.update(key, (value) => (value ?? 0) + 10)

      expect(map.get(key)).toBe(10)
    })

    it('should pass key and map to update function', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}
      const updateSpy = vi.fn().mockReturnValue('result')

      map.update(key, updateSpy)

      expect(updateSpy).toHaveBeenCalledWith(undefined, key, map)
    })

    it('should handle complex update scenarios', () => {
      const map = new TimeoutWeakMap<object, string[]>(1000)
      const key = {}

      // First update creates array
      map.update(key, (arr) => [...(arr ?? []), 'first'])
      expect(map.get(key)).toEqual(['first'])

      // Second update adds to existing array
      map.update(key, (arr) => [...(arr ?? []), 'second'])
      expect(map.get(key)).toEqual(['first', 'second'])
    })
  })

  describe(TimeoutWeakMap.prototype.getOrDefault.name, () => {
    it('should return existing value and refresh timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}
      const factory = vi.fn().mockReturnValue('created')
      const refreshSpy = vi.fn()

      // Mock setTimeout to capture the timeout object
      vi.spyOn(global, 'setTimeout').mockImplementation(((callback: () => void) => {
        const timeout = {
          unref: vi.fn().mockReturnThis(),
          refresh: refreshSpy,
        }
        return timeout as any
      }) as any)

      map.set(key, 'existing')
      refreshSpy.mockClear()

      const result = map.getOrDefault(key, factory)

      expect(result).toBe('existing')
      expect(factory).not.toHaveBeenCalled()
      expect(refreshSpy).toHaveBeenCalled()
    })

    it('should create new value when key does not exist', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}
      const factory = vi.fn().mockReturnValue('created')

      const result = map.getOrDefault(key, factory)

      expect(result).toBe('created')
      expect(factory).toHaveBeenCalledWith(key, map)
      expect(map.get(key)).toBe('created')
    })

    it('should use custom timeout for new entries', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.getOrDefault(key, () => 'created', 2000)

      // Should not expire after default timeout
      vi.advanceTimersByTime(1000)
      expect(map.has(key)).toBe(true)

      // Should expire after custom timeout
      vi.advanceTimersByTime(1000)
      expect(map.has(key)).toBe(false)
    })
  })

  describe('timeout behavior', () => {
    it('should automatically remove entries after timeout', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'test')
      expect(map.has(key)).toBe(true)

      vi.advanceTimersByTime(999)
      expect(map.has(key)).toBe(true)

      vi.advanceTimersByTime(1)
      expect(map.has(key)).toBe(false)
    })

    it('should refresh timeout on get access', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key = {}

      map.set(key, 'test')

      // Access just before expiry
      vi.advanceTimersByTime(999)
      map.get(key) // This should refresh the timeout

      // Should still exist after original timeout
      vi.advanceTimersByTime(1)
      expect(map.has(key)).toBe(true)

      // Should expire after refreshed timeout
      vi.advanceTimersByTime(999)
      expect(map.has(key)).toBe(false)
    })

    it('should handle multiple timeout scenarios', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const key1 = {}
      const key2 = {}
      const key3 = {}

      // Set entries at different times
      map.set(key1, 'first') // Expires at 1000ms
      vi.advanceTimersByTime(500)
      map.set(key2, 'second') // Expires at 1500ms (500 + 1000)
      vi.advanceTimersByTime(300)
      map.set(key3, 'third', 2000) // Custom timeout, expires at 2800ms (800 + 2000)

      // After 200ms more (1000ms total), key1 should expire
      vi.advanceTimersByTime(200)
      expect(map.has(key1)).toBe(false)
      expect(map.has(key2)).toBe(true)
      expect(map.has(key3)).toBe(true)

      // After 500ms more (1500ms total), key2 should expire
      vi.advanceTimersByTime(500)
      expect(map.has(key2)).toBe(false)
      expect(map.has(key3)).toBe(true)

      // After 1300ms more (2800ms total), key3 should expire
      vi.advanceTimersByTime(1300)
      expect(map.has(key3)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle zero timeout', () => {
      const map = new TimeoutWeakMap<object, string>(0)
      const key = {}

      map.set(key, 'test')

      // Should expire immediately
      vi.advanceTimersByTime(0)
      expect(map.has(key)).toBe(false)
    })

    it('should handle negative timeout gracefully', () => {
      const map = new TimeoutWeakMap<object, string>(-1000)
      const key = {}

      expect(() => map.set(key, 'test')).not.toThrow()
      // Behavior with negative timeout depends on setTimeout implementation
    })

    it('should work with different object types as keys', () => {
      const map = new TimeoutWeakMap<object, string>(1000)
      const arrayKey: any[] = []
      const objectKey = {}
      const dateKey = new Date()
      const functionKey = () => {}

      map.set(arrayKey, 'array')
      map.set(objectKey, 'object')
      map.set(dateKey, 'date')
      map.set(functionKey, 'function')

      expect(map.get(arrayKey)).toBe('array')
      expect(map.get(objectKey)).toBe('object')
      expect(map.get(dateKey)).toBe('date')
      expect(map.get(functionKey)).toBe('function')
    })

    it('should handle complex value types', () => {
      interface ComplexValue {
        id: number
        data: string[]
        nested: { flag: boolean }
      }

      const map = new TimeoutWeakMap<object, ComplexValue>(1000)
      const key = {}
      const value: ComplexValue = {
        id: 42,
        data: ['a', 'b', 'c'],
        nested: { flag: true },
      }

      map.set(key, value)
      const retrieved = map.get(key)

      expect(retrieved).toBe(value) // Should be exact same reference
      expect(retrieved?.id).toBe(42)
      expect(retrieved?.data).toEqual(['a', 'b', 'c'])
      expect(retrieved?.nested.flag).toBe(true)
    })
  })
})
