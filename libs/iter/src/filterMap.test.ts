import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterMap } from './filterMap'
import { it } from 'vitest'

describe(filterMap.name, () => {
  it('examples', () => {
    expect(() => {
      // filter by value
      const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const filtered = filterMap(map, (value) => {
        return value > 1
      })
      assert.deepStrictEqual(
        [...filtered],
        [
          ['b', 2],
          ['c', 3],
        ],
        'filtered by value'
      )

      // filter by key
      const filtered2 = filterMap(map, (value, key) => {
        return key !== 'b'
      })
      assert.deepStrictEqual(
        [...filtered2],
        [
          ['a', 1],
          ['c', 3],
        ],
        'filtered by key'
      )

      // empty result
      const empty = filterMap(map, () => {
        return false
      })
      assert.deepStrictEqual([...empty], [], 'empty result')
    }).not.toThrow()
  })

  it('should filter based on value predicate', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ])
    const result = filterMap(map, (value) => {
      return value % 2 === 0
    })
    expect([...result]).toEqual([
      ['b', 2],
      ['d', 4],
    ])
  })

  it('should filter based on key predicate', () => {
    const map = new Map([
      ['apple', 1],
      ['banana', 2],
      ['cherry', 3],
    ])
    const result = filterMap(map, (_, key) => {
      return key.startsWith('a')
    })
    expect([...result]).toEqual([['apple', 1]])
  })

  it('should filter based on combined key-value predicate', () => {
    const map = new Map([
      ['a', 10],
      ['b', 20],
      ['c', 30],
    ])
    const result = filterMap(map, (value, key) => {
      return value > 15 && key !== 'c'
    })
    expect([...result]).toEqual([['b', 20]])
  })

  it('should handle empty map', () => {
    const result = filterMap(new Map(), () => {
      return true
    })
    expect([...result]).toEqual([])
  })

  it('should return empty when no items match', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const result = filterMap(map, (value) => {
      return value > 10
    })
    expect([...result]).toEqual([])
  })

  it('should return all items when all match', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = filterMap(map, () => {
      return true
    })
    expect([...result]).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
  })

  it('should work with numeric keys', () => {
    const map = new Map([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ])
    const result = filterMap(map, (_, key) => {
      return key > 1
    })
    expect([...result]).toEqual([
      [2, 'two'],
      [3, 'three'],
    ])
  })

  it('should work with complex value types', () => {
    const map = new Map([
      ['a', { count: 1 }],
      ['b', { count: 2 }],
      ['c', { count: 3 }],
    ])
    const result = filterMap(map, (value) => {
      return value.count > 1
    })
    expect([...result]).toEqual([
      ['b', { count: 2 }],
      ['c', { count: 3 }],
    ])
  })

  it('should not mutate the original map', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const originalEntries = [...map]
    filterMap(map, (value) => {
      return value > 1
    })
    expect([...map]).toEqual(originalEntries)
  })

  it('should work with ReadonlyMap', () => {
    const map: ReadonlyMap<string, number> = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = filterMap(map, (value) => {
      return value > 1
    })
    expect([...result]).toEqual([
      ['b', 2],
      ['c', 3],
    ])
  })
})
