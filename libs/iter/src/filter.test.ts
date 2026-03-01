import { describe } from 'vitest'
import { expect } from 'vitest'
import { filter } from './filter'
import { it } from 'vitest'

describe(filter.name, () => {
  describe('Map', () => {
    it('should filter a Map with (value, key), returning a new Map', () => {
      const input = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const result = filter(input, (value, key) => {
        const _key: string = key
        void _key
        return value > 1
      })
      expect(result).toBeInstanceOf(Map)
      expect(result).toEqual(
        new Map([
          ['b', 2],
          ['c', 3],
        ])
      )
    })

    it('should filter by key', () => {
      const input = new Map([
        ['keep', 1],
        ['drop', 2],
        ['keep2', 3],
      ])
      const result = filter(input, (_value, key) => {
        return key.startsWith('keep')
      })
      expect(result).toEqual(
        new Map([
          ['keep', 1],
          ['keep2', 3],
        ])
      )
    })
  })

  describe('Set', () => {
    it('should filter a Set with (value), returning a new Set', () => {
      const input = new Set([1, 2, 3, 4, 5])
      const result = filter(input, (value) => {
        const _value: number = value
        void _value
        return value % 2 === 0
      })
      expect(result).toBeInstanceOf(Set)
      expect(result).toEqual(new Set([2, 4]))
    })

    it('should return empty Set when nothing matches', () => {
      const input = new Set([1, 2, 3])
      const result = filter(input, () => {
        return false
      })
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })
  })

  describe('Array', () => {
    it('should filter an array with (value, index), returning a new array', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = filter(arr, (value, index) => {
        const _value: string = value
        const _index: number = index
        void _value
        void _index
        return index % 2 === 0
      })
      expect(result).toEqual(['a', 'c'])
    })

    it('should filter by value', () => {
      const result = filter([1, 2, 3, 4, 5], (value) => {
        return value > 3
      })
      expect(result).toEqual([4, 5])
    })

    it('should work with readonly arrays', () => {
      const arr = [1, 2, 3] as const
      const result = filter(arr, (value) => {
        return value > 1
      })
      expect(result).toEqual([2, 3])
    })

    it('should return empty array when nothing matches', () => {
      const result = filter([1, 2, 3], () => {
        return false
      })
      expect(result).toEqual([])
    })
  })

  describe('Record (plain object)', () => {
    it('should filter an object with (value, key), returning a partial object', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = filter(obj, (value, key) => {
        const _key: string = key
        void _key
        return value > 1
      })
      expect(result).toEqual({ b: 2, c: 3 })
    })

    it('should filter by key', () => {
      const obj = { keep: 1, drop: 2, keepAlso: 3 }
      const result = filter(obj, (_value, key) => {
        return key.startsWith('keep')
      })
      expect(result).toEqual({ keep: 1, keepAlso: 3 })
    })

    it('should work without using key parameter', () => {
      const result = filter({ a: 1, b: 2, c: 3 }, (value) => {
        return value >= 2
      })
      expect(result).toEqual({ b: 2, c: 3 })
    })
  })

  describe('Iterable (catch-all)', () => {
    it('should filter a generator, returning an array', () => {
      function* gen() {
        yield 1
        yield 2
        yield 3
        yield 4
      }
      const result = filter(gen(), (value) => {
        return value % 2 === 0
      })
      expect(result).toEqual([2, 4])
    })

    it('should filter a custom iterable', () => {
      const iterable: Iterable<number> = {
        [Symbol.iterator]: function* () {
          yield 10
          yield 20
          yield 30
        },
      }
      const result = filter(iterable, (value) => {
        return value > 15
      })
      expect(result).toEqual([20, 30])
    })
  })

  describe('type discrimination', () => {
    it('Map and Set should not interfere', () => {
      const m = new Map([
        ['a', 1],
        ['b', 2],
      ])
      const s = new Set([1, 2, 3])

      const mapResult = filter(m, (value) => {
        return value > 1
      })
      expect(mapResult).toBeInstanceOf(Map)
      expect(mapResult).toEqual(new Map([['b', 2]]))

      const setResult = filter(s, (value) => {
        return value > 1
      })
      expect(setResult).toBeInstanceOf(Set)
      expect(setResult).toEqual(new Set([2, 3]))
    })

    it('Array should get index, not be treated as Iterable', () => {
      const arr = [10, 20, 30]
      const result = filter(arr, (_value, index) => {
        return index > 0
      })
      expect(result).toEqual([20, 30])
    })
  })
})
