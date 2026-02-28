import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduce } from './reduce'

describe(reduce.name, () => {
  describe('Map', () => {
    it('should reduce a Map with (acc, value, key)', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const result = reduce(
        map,
        (acc, value, key) => {
          const _key: string = key
          const _value: number = value
          void _key
          void _value
          return acc + value
        },
        0,
      )
      expect(result).toBe(6)
    })

    it('should pass keys from a Map', () => {
      const map = new Map([
        ['x', 10],
        ['y', 20],
      ])
      const keys = reduce(
        map,
        (acc, _value, key) => {
          return [...acc, key]
        },
        [] as string[],
      )
      expect(keys).toEqual(['x', 'y'])
    })

    it('should work with Map<number, string>', () => {
      const map = new Map<number, string>([
        [1, 'one'],
        [2, 'two'],
      ])
      const result = reduce(
        map,
        (acc, value, key) => {
          const _key: number = key
          void _key
          return acc + value
        },
        '',
      )
      expect(result).toBe('onetwo')
    })
  })

  describe('Set', () => {
    it('should reduce a Set with (acc, value)', () => {
      const set = new Set([1, 2, 3])
      const result = reduce(
        set,
        (acc, value) => {
          const _value: number = value
          void _value
          return acc + value
        },
        0,
      )
      expect(result).toBe(6)
    })

    it('should work with Set<string>', () => {
      const set = new Set(['a', 'b', 'c'])
      const result = reduce(
        set,
        (acc, value) => {
          return acc + value
        },
        '',
      )
      expect(result).toBe('abc')
    })

    it('should return initialValue for empty Set', () => {
      const set = new Set<number>()
      const result = reduce(
        set,
        (acc, v) => {
          return acc + v
        },
        99,
      )
      expect(result).toBe(99)
    })
  })

  describe('Array', () => {
    it('should reduce an array with (acc, value, index)', () => {
      const arr = ['a', 'b', 'c']
      const result = reduce(
        arr,
        (acc, value, index) => {
          const _value: string = value
          const _index: number = index
          void _value
          void _index
          return { ...acc, [index]: value }
        },
        {} as Record<number, string>,
      )
      expect(result).toEqual({ 0: 'a', 1: 'b', 2: 'c' })
    })

    it('should pass correct indices', () => {
      const indices = reduce(
        [10, 20, 30],
        (acc, _value, index) => {
          return [...acc, index]
        },
        [] as number[],
      )
      expect(indices).toEqual([0, 1, 2])
    })

    it('should work with readonly arrays', () => {
      const arr = [1, 2, 3] as const
      const result = reduce(
        arr,
        (acc, value) => {
          return acc + value
        },
        0,
      )
      expect(result).toBe(6)
    })

    it('should work without using index parameter', () => {
      const result = reduce(
        [1, 2, 3],
        (acc, value) => {
          return acc + value
        },
        0,
      )
      expect(result).toBe(6)
    })
  })

  describe('Record (plain object)', () => {
    it('should reduce an object with (acc, value, key)', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = reduce(
        obj,
        (acc, value, key) => {
          const _key: string = key
          const _value: number = value
          void _key
          void _value
          return acc + value
        },
        0,
      )
      expect(result).toBe(6)
    })

    it('should pass keys from an object', () => {
      const obj = { x: 'hello', y: 'world' }
      const keys = reduce(
        obj,
        (acc, _value, key) => {
          return [...acc, key]
        },
        [] as string[],
      )
      expect(keys).toEqual(['x', 'y'])
    })

    it('should work without using key parameter', () => {
      const result = reduce(
        { a: 1, b: 2 },
        (acc, value) => {
          return acc + value
        },
        0,
      )
      expect(result).toBe(3)
    })
  })

  describe('Iterable (catch-all)', () => {
    it('should reduce a generator with (acc, value)', () => {
      function* gen() {
        yield 1
        yield 2
        yield 3
      }
      const result = reduce(
        gen(),
        (acc, value) => {
          return acc + value
        },
        0,
      )
      expect(result).toBe(6)
    })

    it('should reduce a custom iterable', () => {
      const iterable: Iterable<number> = {
        [Symbol.iterator]: function* () {
          yield 10
          yield 20
        },
      }
      const result = reduce(
        iterable,
        (acc, value) => {
          return acc + value
        },
        0,
      )
      expect(result).toBe(30)
    })
  })

  describe('type discrimination', () => {
    it('Map and Set should not interfere', () => {
      const map = new Map([['a', 1]])
      const set = new Set([1])

      const mapResult = reduce(
        map,
        (acc, value, key) => {
          return acc + key + value
        },
        '',
      )
      expect(mapResult).toBe('a1')

      const setResult = reduce(
        set,
        (acc, value) => {
          return acc + value
        },
        0,
      )
      expect(setResult).toBe(1)
    })

    it('Array should get index, not be treated as Iterable', () => {
      const arr = [10, 20, 30]
      const result = reduce(
        arr,
        (acc, value, index) => {
          return [...acc, { value, index }]
        },
        [] as { value: number; index: number }[],
      )
      expect(result).toEqual([
        { value: 10, index: 0 },
        { value: 20, index: 1 },
        { value: 30, index: 2 },
      ])
    })
  })
})
