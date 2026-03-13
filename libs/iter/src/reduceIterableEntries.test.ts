import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceIterableEntries } from './reduceIterableEntries'

describe(reduceIterableEntries.name, () => {
  it('examples', () => {
    expect(() => {
      const entries = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]).entries()
      const sum = reduceIterableEntries(
        entries,
        (acc, [k, v]) => {
          return acc + v
        },
        0
      )
      assert.strictEqual(sum, 6, 'sum of values')

      const keys = reduceIterableEntries(
        new Map([
          ['a', 1],
          ['b', 2],
        ]).entries(),
        (acc, [k, v]) => {
          return acc + k
        },
        ''
      )
      assert.strictEqual(keys, 'ab', 'concatenated keys')
    }).not.toThrow()
  })

  it('should reduce iterable of entries', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = reduceIterableEntries(
      map.entries(),
      (acc, [k, v]) => {
        return acc + v
      },
      0
    )
    expect(result).toBe(6)
  })

  it('should have access to keys', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = reduceIterableEntries(
      map.entries(),
      (acc, [k, v]) => {
        return acc + k
      },
      ''
    )
    expect(result).toBe('abc')
  })

  it('should handle empty iterable', () => {
    const result = reduceIterableEntries(
      new Map<string, number>().entries(),
      (acc, [k, v]) => {
        return acc + v
      },
      10
    )
    expect(result).toBe(10)
  })

  it('should support different return type', () => {
    const map = new Map([
      ['x', 10],
      ['y', 20],
    ])
    const result = reduceIterableEntries(
      map.entries(),
      (acc, [k, v]) => {
        return `${acc + k}:${v};`
      },
      ''
    )
    expect(result).toBe('x:10;y:20;')
  })
})
