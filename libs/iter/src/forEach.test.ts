import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEach } from './forEach'
import { it } from 'vitest'

describe(forEach.name, () => {
  describe('Map', () => {
    it('should iterate a Map with (value, key)', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const collected: Array<[string, number]> = []
      forEach(map, (value, key) => {
        const _key: string = key
        const _value: number = value
        void _key
        void _value
        collected.push([key, value])
      })
      expect(collected).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('should work with Map<number, string>', () => {
      const map = new Map<number, string>([
        [1, 'one'],
        [2, 'two'],
      ])
      const keys: number[] = []
      const values: string[] = []
      forEach(map, (value, key) => {
        keys.push(key)
        values.push(value)
      })
      expect(keys).toEqual([1, 2])
      expect(values).toEqual(['one', 'two'])
    })
  })

  describe('Set', () => {
    it('should iterate a Set with (value)', () => {
      const set = new Set([1, 2, 3])
      const values: number[] = []
      forEach(set, (value) => {
        const _value: number = value
        void _value
        values.push(value)
      })
      expect(values).toEqual([1, 2, 3])
    })

    it('should work with Set<string>', () => {
      const set = new Set(['a', 'b', 'c'])
      const values: string[] = []
      forEach(set, (value) => {
        values.push(value)
      })
      expect(values).toEqual(['a', 'b', 'c'])
    })

    it('should do nothing for empty Set', () => {
      const set = new Set<number>()
      let called = false
      forEach(set, () => {
        called = true
      })
      expect(called).toBe(false)
    })
  })

  describe('Array', () => {
    it('should iterate an array with (value, index)', () => {
      const arr = ['a', 'b', 'c']
      const collected: Array<{ value: string; index: number }> = []
      forEach(arr, (value, index) => {
        const _value: string = value
        const _index: number = index
        void _value
        void _index
        collected.push({ value, index })
      })
      expect(collected).toEqual([
        { value: 'a', index: 0 },
        { value: 'b', index: 1 },
        { value: 'c', index: 2 },
      ])
    })

    it('should pass correct indices', () => {
      const indices: number[] = []
      forEach([10, 20, 30], (_value, index) => {
        indices.push(index)
      })
      expect(indices).toEqual([0, 1, 2])
    })

    it('should work with readonly arrays', () => {
      const arr = [1, 2, 3] as const
      const values: number[] = []
      forEach(arr, (value) => {
        values.push(value)
      })
      expect(values).toEqual([1, 2, 3])
    })

    it('should work without using index parameter', () => {
      const values: number[] = []
      forEach([1, 2, 3], (value) => {
        values.push(value)
      })
      expect(values).toEqual([1, 2, 3])
    })
  })

  describe('Record (plain object)', () => {
    it('should iterate an object with (value, key)', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const collected: Array<[string, number]> = []
      forEach(obj, (value, key) => {
        const _key: string = key
        const _value: number = value
        void _key
        void _value
        collected.push([key, value])
      })
      expect(collected).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('should pass keys from an object', () => {
      const obj = { x: 'hello', y: 'world' }
      const keys: string[] = []
      forEach(obj, (_value, key) => {
        keys.push(key)
      })
      expect(keys).toEqual(['x', 'y'])
    })

    it('should work without using key parameter', () => {
      const values: number[] = []
      forEach({ a: 1, b: 2 }, (value) => {
        values.push(value)
      })
      expect(values).toEqual([1, 2])
    })
  })

  describe('Iterable (catch-all)', () => {
    it('should iterate a generator with (value)', () => {
      function* gen() {
        yield 1
        yield 2
        yield 3
      }
      const values: number[] = []
      forEach(gen(), (value) => {
        values.push(value)
      })
      expect(values).toEqual([1, 2, 3])
    })

    it('should iterate a custom iterable', () => {
      const iterable: Iterable<number> = {
        [Symbol.iterator]: function* () {
          yield 10
          yield 20
        },
      }
      const values: number[] = []
      forEach(iterable, (value) => {
        values.push(value)
      })
      expect(values).toEqual([10, 20])
    })
  })

  describe('type discrimination', () => {
    it('Map and Set should not interfere', () => {
      const map = new Map([['a', 1]])
      const set = new Set([1])

      const mapPairs: string[] = []
      forEach(map, (value, key) => {
        mapPairs.push(`${key}=${value}`)
      })
      expect(mapPairs).toEqual(['a=1'])

      const setValues: number[] = []
      forEach(set, (value) => {
        setValues.push(value)
      })
      expect(setValues).toEqual([1])
    })

    it('Array should get index, not be treated as Iterable', () => {
      const arr = [10, 20, 30]
      const result: Array<{ value: number; index: number }> = []
      forEach(arr, (value, index) => {
        result.push({ value, index })
      })
      expect(result).toEqual([
        { value: 10, index: 0 },
        { value: 20, index: 1 },
        { value: 30, index: 2 },
      ])
    })
  })
})
