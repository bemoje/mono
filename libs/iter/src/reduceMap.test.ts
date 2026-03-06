import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceMap } from './reduceMap'

describe(reduceMap.name, () => {
  it('examples', () => {
    expect(() => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const sum = reduceMap(
        map,
        (acc, v) => {
          return acc + v
        },
        0
      )
      assert.strictEqual(sum, 6, 'sum of values')

      const keys = reduceMap(
        map,
        (acc, v, k) => {
          return acc + k
        },
        ''
      )
      assert.strictEqual(keys, 'abc', 'concatenated keys')
    }).not.toThrow()
  })

  it('should reduce map to sum', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = reduceMap(
      map,
      (acc, value) => {
        return acc + value
      },
      0
    )
    expect(result).toBe(6)
  })

  it('should use key parameter', () => {
    const map = new Map([
      ['x', 1],
      ['y', 2],
      ['z', 3],
    ])
    const result = reduceMap(
      map,
      (acc, value, key) => {
        return acc + key
      },
      ''
    )
    expect(result).toBe('xyz')
  })

  it('should handle empty map', () => {
    const result = reduceMap(
      new Map<string, number>(),
      (acc, value) => {
        return acc + value
      },
      10
    )
    expect(result).toBe(10)
  })

  it('should work with readonly map', () => {
    const map: ReadonlyMap<string, number> = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const result = reduceMap(
      map,
      (acc, value) => {
        return acc + value
      },
      0
    )
    expect(result).toBe(3)
  })

  it('should support different return type', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const result = reduceMap(
      map,
      (acc, value) => {
        return acc + String(value)
      },
      ''
    )
    expect(result).toBe('12')
  })
})
