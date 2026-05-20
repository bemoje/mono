import { ApiReponseCache } from './ApiReponseCache'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

describe(ApiReponseCache.name, () => {
  console.log = vi.fn()
  console.error = vi.fn()
  console.warn = vi.fn()
  console.dir = vi.fn()

  const cache = new ApiReponseCache<any>({ dirpath: 'testing', maxAgeMs: 1000 })

  describe('constructor', () => {
    it('should create a new instance with default options', () => {
      expect(cache).toBeDefined()
      expect(cache.db).toBeDefined()
      expect(cache.maxAgeMs).toBe(1000)
    })

    it('should create a new instance with custom options', async () => {
      const options = {
        dirpath: 'test',
        maxAgeMs: 60000,
      }
      const cache = new ApiReponseCache<any>(options)
      expect(cache).toBeDefined()
      expect(cache.db).toBeDefined()
      expect(cache.maxAgeMs).toBe(60000)
    })
  })

  describe('getOrElse', () => {
    it('should return the value if it exists in the cache', async () => {
      await cache.clear()
      const key = 'test'
      await cache.set(key, 'value')
      const value = await cache.getOrElse(key, () => 'new value')
      expect(value).toBe('value')
    })

    it('should retrieve a new value if it does not exist in the cache', async () => {
      await cache.clear()
      const key = 'test'
      const value = await cache.getOrElse(key, () => 'new value')
      expect(value).toBe('new value')
    })
  })

  describe('getUnsafe', () => {
    it('should return the value if it exists in the cache', async () => {
      await cache.clear()
      const key = 'test'
      await cache.set(key, 'value')
      const value = await cache.getUnsafe(key)
      expect(value).toBe('value')
    })

    it('should throw an error if the value does not exist in the cache', async () => {
      await cache.clear()
      const key = 'test'
      await expect(async () => cache.getUnsafe(key)).rejects.toThrow()
    })
  })

  describe('get', () => {
    it('should return the value if it exists in the cache', async () => {
      await cache.clear()
      const key = 'test'
      await cache.set(key, 'value')
      const value = await cache.get(key)
      expect(value).toBe('value')
    })

    it('should return undefined if the value does not exist in the cache', async () => {
      await cache.clear()
      const key = 'test'
      const value = await cache.get(key)
      expect(value).toBeUndefined()
    })
  })

  describe('has', () => {
    it('should return true if the value exists in the cache', async () => {
      await cache.clear()
      const key = 'test'
      await cache.set(key, 'value')
      const exists = await cache.has(key)
      expect(exists).toBe(true)
    })

    it('should return false if the value does not exist in the cache', async () => {
      await cache.clear()
      const key = 'test'
      const exists = await cache.has(key)
      expect(exists).toBe(false)
    })
  })

  describe('set', () => {
    it('should store the value in the cache', async () => {
      await cache.clear()
      const key = 'test'
      await cache.set(key, 'value')
      const exists = await cache.has(key)
      expect(exists).toBe(true)
    })
  })

  describe('delete', () => {
    it('should delete the value from the cache', async () => {
      await cache.clear()
      const key = 'test'
      await cache.set(key, 'value')
      await cache.delete(key)
      const exists = await cache.has(key)
      expect(exists).toBe(false)
    })
  })

  describe('clearExpired', () => {
    it('should delete all expired data from the cache', async () => {
      await cache.clear()
      const key1 = 'test1'
      const key2 = 'test2'
      await cache.set(key1, 'value1')
      await cache.set(key2, 'value2')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await cache.clearExpired()
      const exists1 = await cache.has(key1)
      const exists2 = await cache.has(key2)
      expect(exists1).toBe(false)
      expect(exists2).toBe(false)
    })
  })

  describe('clear', () => {
    it('should delete all cached API responses', async () => {
      await cache.clear()
      const key1 = 'test1'
      const key2 = 'test2'
      await cache.set(key1, 'value1')
      await cache.set(key2, 'value2')
      await cache.clear()
      const exists1 = await cache.has(key1)
      const exists2 = await cache.has(key2)
      expect(exists1).toBe(false)
      expect(exists2).toBe(false)
    })
  })

  describe('entries', () => {
    it('should iterate over all [key, value] pairs in the cache', async () => {
      await cache.clear()
      const key1 = 'test1'
      const key2 = 'test2'
      await cache.set(key1, 'value')
      await cache.set(key2, 'value')
      const entries: [string, any][] = []
      for await (const entry of cache.entries()) {
        entries.push(entry)
      }
      expect(entries.length).toBe(2)
      expect(typeof entries[1][0]).toBe('string')
      expect(entries[1][1]).toBe('value')
      expect(typeof entries[0][0]).toBe('string')
      expect(entries[0][1]).toBe('value')
    })
  })

  describe('keys', () => {
    it('should iterate over all keys in the cache', async () => {
      await cache.clear()
      const key1 = 'test1'
      const key2 = 'test2'
      await cache.set(key1, 'value1')
      await cache.set(key2, 'value2')
      const keys: string[] = []
      for await (const key of cache.keys()) {
        keys.push(key)
      }
      expect(keys.length).toBe(2)
      expect(typeof keys[1]).toBe('string')
      expect(typeof keys[0]).toBe('string')
    })
  })

  describe('values', () => {
    it('should iterate over all values in the cache', async () => {
      await cache.clear()
      const key1 = 'test1'
      const key2 = 'test2'
      await cache.set(key1, 'value')
      await cache.set(key2, 'value')
      const values: any[] = []
      for await (const value of cache.values()) {
        values.push(value)
      }
      expect(values.length).toBe(2)
      expect(values[1]).toBe('value')
      expect(values[0]).toBe('value')
    })
  })

  describe('size', () => {
    it('should return the number of entries in the cache', async () => {
      await cache.clear()
      expect(await cache.size()).toBe(0)
      const key1 = 'test1'
      const key2 = 'test2'
      await cache.set(key1, 'value1')
      await cache.set(key2, 'value2')
      expect(await cache.size()).toBe(2)
    })
  })
})
