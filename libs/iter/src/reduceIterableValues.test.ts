import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceIterableValues } from './reduceIterableValues'

describe(reduceIterableValues.name, () => {
  it('examples', () => {
    expect(() => {
      const entries = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]).entries()
      const sum = reduceIterableValues(
        entries,
        (acc, v) => {
          return acc + v
        },
        0
      )
      assert.strictEqual(sum, 6, 'sum of values')
    }).not.toThrow()
  })

  it('should reduce just the values', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = reduceIterableValues(
      map.entries(),
      (acc, v) => {
        return acc + v
      },
      0
    )
    expect(result).toBe(6)
  })

  it('should handle empty iterable', () => {
    const result = reduceIterableValues(
      new Map<string, number>().entries(),
      (acc, v) => {
        return acc + v
      },
      10
    )
    expect(result).toBe(10)
  })

  it('should work with object entries', () => {
    const obj = { x: 10, y: 20, z: 30 }
    const result = reduceIterableValues(
      Object.entries(obj),
      (acc, v) => {
        return acc + v
      },
      0
    )
    expect(result).toBe(60)
  })

  it('should support different return type', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const result = reduceIterableValues(
      map.entries(),
      (acc, v) => {
        return acc + String(v)
      },
      ''
    )
    expect(result).toBe('12')
  })
})
