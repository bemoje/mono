import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachObject } from './forEachObject'
import { it } from 'vitest'

describe(forEachObject.name, () => {
  it('examples', () => {
    expect(() => {
      // iterate object
      const obj = { a: 1, b: 2, c: 3 }
      const results: string[] = []
      forEachObject(obj, (value, key) => {
        results.push(`${String(key)}:${value}`)
      })
      assert.deepStrictEqual(results, ['a:1', 'b:2', 'c:3'], 'forEach object')
    }).not.toThrow()
  })

  it('should execute callback for each property', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const values: number[] = []
    forEachObject(obj, (value) => {
      values.push(value)
    })
    expect(values).toEqual([1, 2, 3])
  })

  it('should provide both value and key', () => {
    const obj = { apple: 1, banana: 2 }
    const results: Array<[number, string]> = []
    forEachObject(obj, (value, key) => {
      results.push([value, String(key)])
    })
    expect(results).toEqual([
      [1, 'apple'],
      [2, 'banana'],
    ])
  })

  it('should handle empty object', () => {
    let called = false
    forEachObject({}, () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with complex value types', () => {
    const obj = { user1: { name: 'Alice', age: 25 }, user2: { name: 'Bob', age: 30 } }
    const names: string[] = []
    forEachObject(obj, (value) => {
      names.push(value.name)
    })
    expect(names).toEqual(['Alice', 'Bob'])
  })

  it('should allow side effects', () => {
    const obj = { a: 1, b: 2, c: 3 }
    let sum = 0
    forEachObject(obj, (value) => {
      sum += value
    })
    expect(sum).toBe(6)
  })
})
