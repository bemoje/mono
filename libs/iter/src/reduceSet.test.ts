import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceSet } from './reduceSet'

describe(reduceSet.name, () => {
  it('examples', () => {
    expect(() => {
      const set = new Set([1, 2, 3, 4, 5])
      const sum = reduceSet(
        set,
        (acc, v) => {
          return acc + v
        },
        0
      )
      assert.strictEqual(sum, 15, 'sum of values')

      const product = reduceSet(
        set,
        (acc, v) => {
          return acc * v
        },
        1
      )
      assert.strictEqual(product, 120, 'product of values')
    }).not.toThrow()
  })

  it('should reduce set to sum', () => {
    const set = new Set([1, 2, 3, 4, 5])
    const result = reduceSet(
      set,
      (acc, value) => {
        return acc + value
      },
      0
    )
    expect(result).toBe(15)
  })

  it('should handle empty set', () => {
    const result = reduceSet(
      new Set<number>(),
      (acc, value) => {
        return acc + value
      },
      10
    )
    expect(result).toBe(10)
  })

  it('should work with readonly set', () => {
    const set: ReadonlySet<number> = new Set([1, 2, 3])
    const result = reduceSet(
      set,
      (acc, value) => {
        return acc + value
      },
      0
    )
    expect(result).toBe(6)
  })

  it('should support different return type', () => {
    const set = new Set([1, 2, 3])
    const result = reduceSet(
      set,
      (acc, value) => {
        return acc + String(value)
      },
      ''
    )
    expect(result).toBe('123')
  })

  it('should work with string set', () => {
    const set = new Set(['a', 'b', 'c'])
    const result = reduceSet(
      set,
      (acc, value) => {
        return acc + value
      },
      ''
    )
    expect(result).toBe('abc')
  })
})
