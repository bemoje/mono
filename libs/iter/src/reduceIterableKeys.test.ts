import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceIterableKeys } from './reduceIterableKeys'

describe(reduceIterableKeys.name, () => {
  it('examples', () => {
    expect(() => {
      const entries = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]).entries()
      const keys = reduceIterableKeys(
        entries,
        (acc, k) => {
          return acc + k
        },
        ''
      )
      assert.strictEqual(keys, 'abc', 'concatenated keys')
    }).not.toThrow()
  })

  it('should reduce just the keys', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = reduceIterableKeys(
      map.entries(),
      (acc, k) => {
        return acc + k
      },
      ''
    )
    expect(result).toBe('abc')
  })

  it('should handle empty iterable', () => {
    const result = reduceIterableKeys(
      new Map<string, number>().entries(),
      (acc, k) => {
        return acc + k
      },
      'init'
    )
    expect(result).toBe('init')
  })

  it('should work with object entries', () => {
    const obj = { x: 10, y: 20, z: 30 }
    const result = reduceIterableKeys(
      Object.entries(obj),
      (acc, k) => {
        return acc + k
      },
      ''
    )
    expect(result).toBe('xyz')
  })

  it('should support different return type', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const result = reduceIterableKeys(
      map.entries(),
      (acc, k) => {
        return acc + 1
      },
      0
    )
    expect(result).toBe(2)
  })
})
