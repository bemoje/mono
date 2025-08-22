import { describe, it, expect } from 'vitest'
import { ExtMap } from './ExtMap'

describe('ExtMap', () => {
  describe('constructor', () => {
    it('creates an empty map', () => {
      const map = new ExtMap<string, number>()
      expect(map.size).toBe(0)
    })

    it('creates a map from entries', () => {
      const map = new ExtMap<string, number>([
        ['a', 1],
        ['b', 2],
      ])
      expect(map.size).toBe(2)
      expect(map.get('a')).toBe(1)
      expect(map.get('b')).toBe(2)
    })
  })

  describe('load()', () => {
    it('loads entries into the map', () => {
      const map = new ExtMap<string, number>()
      map.load([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      expect(map.size).toBe(3)
      expect(map.get('a')).toBe(1)
      expect(map.get('b')).toBe(2)
      expect(map.get('c')).toBe(3)
    })

    it('returns this for chaining', () => {
      const map = new ExtMap<string, number>()
      const result = map.load([['a', 1]])
      expect(result).toBe(map)
    })

    it('overwrites existing keys', () => {
      const map = new ExtMap<string, number>([['a', 1]])
      map.load([['a', 2]])
      expect(map.get('a')).toBe(2)
    })
  })

  describe('update()', () => {
    it('updates a value with the result of the update function', () => {
      const map = new ExtMap<string, number>([['a', 1]])
      map.update('a', (v) => (v ?? 0) + 10)
      expect(map.get('a')).toBe(11)
    })

    it('sets a value if key does not exist', () => {
      const map = new ExtMap<string, number>()
      map.update('a', (v) => (v ?? 0) + 5)
      expect(map.get('a')).toBe(5)
    })

    it('provides key and map to the update function', () => {
      const map = new ExtMap<string, number>()
      map.update('a', (v, k, m) => {
        expect(k).toBe('a')
        expect(m).toBe(map)
        return 42
      })
      expect(map.get('a')).toBe(42)
    })

    it('returns this for chaining', () => {
      const map = new ExtMap<string, number>()
      const result = map.update('a', () => 1)
      expect(result).toBe(map)
    })
  })

  describe('getOrDefault()', () => {
    it('returns existing value if key exists', () => {
      const map = new ExtMap<string, number>([['a', 1]])
      const value = map.getOrDefault('a', () => 999)
      expect(value).toBe(1)
    })

    it('creates and stores default value if key does not exist', () => {
      const map = new ExtMap<string, number>()
      const value = map.getOrDefault('a', () => 42)
      expect(value).toBe(42)
      expect(map.get('a')).toBe(42) // Value was stored
    })

    it('handles undefined values correctly', () => {
      const map = new ExtMap<string, number | undefined>()
      map.set('a', undefined)
      const value = map.getOrDefault('a', () => 42)
      expect(value).toBeUndefined()
    })

    it('provides key and map to factory function', () => {
      const map = new ExtMap<string, number>()
      map.getOrDefault('a', (k, m) => {
        expect(k).toBe('a')
        expect(m).toBe(map)
        return 42
      })
    })
  })

  describe('sort()', () => {
    it('sorts entries using compare function', () => {
      const map = new ExtMap<string, number>([
        ['c', 3],
        ['a', 1],
        ['b', 2],
      ])

      map.sort(([k1], [k2]) => k1.localeCompare(k2))

      const entries = Array.from(map.entries())
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('returns this for chaining', () => {
      const map = new ExtMap<string, number>([['a', 1]])
      const result = map.sort(() => 0)
      expect(result).toBe(map)
    })
  })

  describe('sortByKeys()', () => {
    it('sorts entries by keys', () => {
      const map = new ExtMap<string, number>([
        ['c', 3],
        ['a', 1],
        ['b', 2],
      ])

      map.sortByKeys((a, b) => a.localeCompare(b))

      const entries = Array.from(map.entries())
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('returns this for chaining', () => {
      const map = new ExtMap<string, number>([['a', 1]])
      const result = map.sortByKeys(() => 0)
      expect(result).toBe(map)
    })
  })

  describe('sortByValues()', () => {
    it('sorts entries by values', () => {
      const map = new ExtMap<string, number>([
        ['c', 3],
        ['a', 1],
        ['b', 2],
      ])

      map.sortByValues((a, b) => a - b)

      const entries = Array.from(map.entries())
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('returns this for chaining', () => {
      const map = new ExtMap<string, number>([['a', 1]])
      const result = map.sortByValues(() => 0)
      expect(result).toBe(map)
    })
  })

  describe('clone()', () => {
    it('creates a new map with the same entries', () => {
      const map = new ExtMap<string, number>([
        ['a', 1],
        ['b', 2],
      ])
      const clone = map.clone()

      expect(clone).not.toBe(map)
      expect(clone).toBeInstanceOf(ExtMap)
      expect(clone.size).toBe(2)
      expect(clone.get('a')).toBe(1)
      expect(clone.get('b')).toBe(2)
    })
  })

  describe('toJSON()', () => {
    it('returns an array of entries', () => {
      const map = new ExtMap<string, number>([
        ['a', 1],
        ['b', 2],
      ])
      const json = map.toJSON()
      expect(json).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })
  })

  describe('Symbol.toStringTag', () => {
    it('returns "ExtMap"', () => {
      const map = new ExtMap<string, number>()
      expect(Object.prototype.toString.call(map)).toBe('[object ExtMap]')
    })
  })

  describe('mapValues', () => {
    it('should transform values while preserving keys', () => {
      const map = new ExtMap([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])

      const doubled = map.mapValues((v) => v * 2)

      expect(doubled.get('a')).toBe(2)
      expect(doubled.get('b')).toBe(4)
      expect(doubled.get('c')).toBe(6)
      expect(doubled).toBeInstanceOf(ExtMap)
    })
  })

  describe('mapKeys', () => {
    it('should transform keys while preserving values', () => {
      const map = new ExtMap([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])

      const uppercased = map.mapKeys((k) => k.toUpperCase())

      expect(uppercased.get('A')).toBe(1)
      expect(uppercased.get('B')).toBe(2)
      expect(uppercased.get('C')).toBe(3)
      expect(uppercased).toBeInstanceOf(ExtMap)
    })
  })

  describe('filter', () => {
    it('should filter entries based on predicate', () => {
      const map = new ExtMap([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ])

      const evens = map.filter((v) => v % 2 === 0)

      expect(evens.size).toBe(2)
      expect(evens.get('b')).toBe(2)
      expect(evens.get('d')).toBe(4)
      expect(evens.has('a')).toBe(false)
      expect(evens.has('c')).toBe(false)
      expect(evens).toBeInstanceOf(ExtMap)
    })
  })

  describe('forEach', () => {
    it('should execute callback for each entry', () => {
      const map = new ExtMap([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])

      const collected: [string, number][] = []
      map.forEach((value, key) => {
        collected.push([key, value])
      })

      expect(collected).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })
  })

  describe('reduce', () => {
    it('should reduce map to a single value', () => {
      const map = new ExtMap([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])

      const sum = map.reduce((acc, value) => acc + value, 0)

      expect(sum).toBe(6)
    })
  })
})
