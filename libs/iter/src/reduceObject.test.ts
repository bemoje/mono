import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceObject } from './reduceObject'

describe(reduceObject.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { a: 1, b: 2, c: 3 }
      const sum = reduceObject(
        obj,
        (acc, v) => {
          return acc + v
        },
        0
      )
      assert.strictEqual(sum, 6, 'sum of values')

      const keys = reduceObject(
        obj,
        (acc, v, k) => {
          return acc + k
        },
        ''
      )
      assert.strictEqual(keys, 'abc', 'concatenated keys')
    }).not.toThrow()
  })

  it('should reduce object to sum', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = reduceObject(
      obj,
      (acc, value) => {
        return acc + value
      },
      0
    )
    expect(result).toBe(6)
  })

  it('should use key parameter', () => {
    const obj = { x: 10, y: 20, z: 30 }
    const result = reduceObject(
      obj,
      (acc, value, key) => {
        return acc + key
      },
      ''
    )
    expect(result).toBe('xyz')
  })

  it('should handle empty object', () => {
    const result = reduceObject(
      {},
      (acc, value: number) => {
        return acc + value
      },
      10
    )
    expect(result).toBe(10)
  })

  it('should support different return type', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = reduceObject(
      obj,
      (acc, value) => {
        return acc + String(value)
      },
      ''
    )
    expect(result).toBe('123')
  })

  it('should work with type inference', () => {
    const obj = { a: 'hello', b: 'world' }
    const result = reduceObject(
      obj,
      (acc, value) => {
        return acc + value.length
      },
      0
    )
    expect(result).toBe(10)
  })
})
