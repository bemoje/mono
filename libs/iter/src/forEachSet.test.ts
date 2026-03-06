import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachSet } from './forEachSet'
import { it } from 'vitest'

describe(forEachSet.name, () => {
  it('examples', () => {
    expect(() => {
      // iterate set
      const set = new Set([1, 2, 3, 4, 5])
      const results: number[] = []
      forEachSet(set, (n) => {
        results.push(n * 2)
      })
      assert.deepStrictEqual(results, [2, 4, 6, 8, 10], 'forEach set')
    }).not.toThrow()
  })

  it('should execute callback for each value', () => {
    const set = new Set([1, 2, 3, 4, 5])
    const results: number[] = []
    forEachSet(set, (value) => {
      results.push(value)
    })
    expect(results).toEqual([1, 2, 3, 4, 5])
  })

  it('should handle empty set', () => {
    let called = false
    forEachSet(new Set(), () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with string values', () => {
    const set = new Set(['apple', 'banana', 'cherry'])
    const results: string[] = []
    forEachSet(set, (value) => {
      results.push(value)
    })
    expect(results).toEqual(['apple', 'banana', 'cherry'])
  })

  it('should work with ReadonlySet', () => {
    const set: ReadonlySet<number> = new Set([1, 2, 3])
    const results: number[] = []
    forEachSet(set, (value) => {
      results.push(value)
    })
    expect(results).toEqual([1, 2, 3])
  })

  it('should work with complex objects', () => {
    const obj1 = { id: 1, name: 'Alice' }
    const obj2 = { id: 2, name: 'Bob' }
    const set = new Set([obj1, obj2])
    const names: string[] = []
    forEachSet(set, (item) => {
      names.push(item.name)
    })
    expect(names).toEqual(['Alice', 'Bob'])
  })

  it('should allow side effects', () => {
    const set = new Set([1, 2, 3, 4])
    let sum = 0
    forEachSet(set, (value) => {
      sum += value
    })
    expect(sum).toBe(10)
  })
})
