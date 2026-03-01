import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { map } from './map'

describe(map.name, () => {
  describe('Map', () => {
    it('should map a Map with (value, key), returning a new Map', () => {
      const input = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const result = map(input, (value, key) => {
        const _key: string = key
        const _value: number = value
        void _key
        void _value
        return value * 2
      })
      expect(result).toBeInstanceOf(Map)
      expect(result).toEqual(
        new Map([
          ['a', 2],
          ['b', 4],
          ['c', 6],
        ])
      )
    })

    it('should work with Map<number, string>', () => {
      const input = new Map<number, string>([
        [1, 'one'],
        [2, 'two'],
      ])
      const result = map(input, (value, key) => {
        const _key: number = key
        void _key
        return value.toUpperCase()
      })
      expect(result).toEqual(
        new Map([
          [1, 'ONE'],
          [2, 'TWO'],
        ])
      )
    })
  })

  describe('Set', () => {
    it('should map a Set with (value), returning a new Set', () => {
      const input = new Set([1, 2, 3])
      const result = map(input, (value) => {
        const _value: number = value
        void _value
        return value * 10
      })
      expect(result).toBeInstanceOf(Set)
      expect(result).toEqual(new Set([10, 20, 30]))
    })

    it('should work with Set<string>', () => {
      const input = new Set(['a', 'b', 'c'])
      const result = map(input, (value) => {
        return value.toUpperCase()
      })
      expect(result).toEqual(new Set(['A', 'B', 'C']))
    })

    it('should return empty Set for empty Set', () => {
      const input = new Set<number>()
      const result = map(input, (v) => {
        return v * 2
      })
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })
  })

  describe('Array', () => {
    it('should map an array with (value, index), returning a new array', () => {
      const arr = ['a', 'b', 'c']
      const result = map(arr, (value, index) => {
        const _value: string = value
        const _index: number = index
        void _value
        void _index
        return { value, index }
      })
      expect(result).toEqual([
        { value: 'a', index: 0 },
        { value: 'b', index: 1 },
        { value: 'c', index: 2 },
      ])
    })

    it('should pass correct indices', () => {
      const result = map([10, 20, 30], (_value, index) => {
        return index
      })
      expect(result).toEqual([0, 1, 2])
    })

    it('should work with readonly arrays', () => {
      const arr = [1, 2, 3] as const
      const result = map(arr, (value) => {
        return value * 2
      })
      expect(result).toEqual([2, 4, 6])
    })

    it('should work without using index parameter', () => {
      const result = map([1, 2, 3], (value) => {
        return value + 1
      })
      expect(result).toEqual([2, 3, 4])
    })
  })

  describe('Record (plain object)', () => {
    it('should map an object with (value, key), returning a new object', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = map(obj, (value, key) => {
        const _key: string = key
        const _value: number = value
        void _key
        void _value
        return value * 2
      })
      expect(result).toEqual({ a: 2, b: 4, c: 6 })
    })

    it('should work without using key parameter', () => {
      const result = map({ x: 'hello', y: 'world' }, (value) => {
        return value.toUpperCase()
      })
      expect(result).toEqual({ x: 'HELLO', y: 'WORLD' })
    })
  })

  describe('Iterable (catch-all)', () => {
    it('should map a generator, returning an array', () => {
      function* gen() {
        yield 1
        yield 2
        yield 3
      }
      const result = map(gen(), (value) => {
        return value * 2
      })
      expect(result).toEqual([2, 4, 6])
    })

    it('should map a custom iterable', () => {
      const iterable: Iterable<number> = {
        [Symbol.iterator]: function* () {
          yield 10
          yield 20
        },
      }
      const result = map(iterable, (value) => {
        return value + 1
      })
      expect(result).toEqual([11, 21])
    })
  })

  describe('type discrimination', () => {
    it('Map and Set should not interfere', () => {
      const m = new Map([['a', 1]])
      const s = new Set([1])

      const mapResult = map(m, (value, key) => {
        return `${key}=${value}`
      })
      expect(mapResult).toBeInstanceOf(Map)
      expect(mapResult.get('a')).toBe('a=1')

      const setResult = map(s, (value) => {
        return value * 10
      })
      expect(setResult).toBeInstanceOf(Set)
      expect(setResult.has(10)).toBe(true)
    })

    it('Array should get index, not be treated as Iterable', () => {
      const arr = [10, 20, 30]
      const result = map(arr, (value, index) => {
        return { value, index }
      })
      expect(result).toEqual([
        { value: 10, index: 0 },
        { value: 20, index: 1 },
        { value: 30, index: 2 },
      ])
    })
  })
})
