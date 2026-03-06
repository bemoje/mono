import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceArray } from './reduceArray'

describe(reduceArray.name, () => {
  it('examples', () => {
    expect(() => {
      const numbers = [1, 2, 3, 4, 5]
      const sum = reduceArray(
        numbers,
        (acc, n) => {
          return acc + n
        },
        0
      )
      assert.strictEqual(sum, 15, 'sum of numbers')

      const product = reduceArray(
        numbers,
        (acc, n) => {
          return acc * n
        },
        1
      )
      assert.strictEqual(product, 120, 'product of numbers')
    }).not.toThrow()
  })

  it('should reduce to sum', () => {
    const array = [1, 2, 3, 4, 5]
    const result = reduceArray(
      array,
      (acc, value) => {
        return acc + value
      },
      0
    )
    expect(result).toBe(15)
  })

  it('should use index', () => {
    const array = [1, 2, 3]
    const result = reduceArray(
      array,
      (acc, value, index) => {
        return acc + index
      },
      0
    )
    expect(result).toBe(3)
  })

  it('should handle empty array', () => {
    const result = reduceArray(
      [],
      (acc, value: number) => {
        return acc + value
      },
      10
    )
    expect(result).toBe(10)
  })

  it('should work with readonly arrays', () => {
    const array: readonly number[] = [1, 2, 3]
    const result = reduceArray(
      array,
      (acc, value) => {
        return acc + value
      },
      0
    )
    expect(result).toBe(6)
  })

  it('should support different return type', () => {
    const array = [1, 2, 3]
    const result = reduceArray(
      array,
      (acc, value) => {
        return acc + String(value)
      },
      ''
    )
    expect(result).toBe('123')
  })
})
