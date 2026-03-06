import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterSet } from './filterSet'
import { it } from 'vitest'

describe(filterSet.name, () => {
  it('examples', () => {
    expect(() => {
      // filter numbers
      const set = new Set([1, 2, 3, 4, 5])
      const evens = filterSet(set, (n) => {
        return n % 2 === 0
      })
      assert.deepStrictEqual([...evens], [2, 4], 'filtered even numbers')

      // filter strings
      const strings = new Set(['apple', 'banana', 'apricot'])
      const startsWithA = filterSet(strings, (s) => {
        return s.startsWith('a')
      })
      assert.deepStrictEqual([...startsWithA], ['apple', 'apricot'], 'filtered strings')

      // empty result
      const empty = filterSet(set, () => {
        return false
      })
      assert.deepStrictEqual([...empty], [], 'empty result')
    }).not.toThrow()
  })

  it('should filter based on value predicate', () => {
    const set = new Set([1, 2, 3, 4, 5, 6])
    const result = filterSet(set, (value) => {
      return value > 3
    })
    expect([...result]).toEqual([4, 5, 6])
  })

  it('should handle empty set', () => {
    const result = filterSet(new Set(), () => {
      return true
    })
    expect([...result]).toEqual([])
  })

  it('should return empty when no items match', () => {
    const set = new Set([1, 2, 3])
    const result = filterSet(set, (value) => {
      return value > 10
    })
    expect([...result]).toEqual([])
  })

  it('should return all items when all match', () => {
    const set = new Set([1, 2, 3])
    const result = filterSet(set, () => {
      return true
    })
    expect([...result]).toEqual([1, 2, 3])
  })

  it('should work with string values', () => {
    const set = new Set(['apple', 'banana', 'cherry', 'apricot'])
    const result = filterSet(set, (value) => {
      return value.startsWith('a')
    })
    expect([...result]).toEqual(['apple', 'apricot'])
  })

  it('should work with complex objects', () => {
    const obj1 = { id: 1, name: 'Alice' }
    const obj2 = { id: 2, name: 'Bob' }
    const obj3 = { id: 3, name: 'Charlie' }
    const set = new Set([obj1, obj2, obj3])
    const result = filterSet(set, (item) => {
      return item.id > 1
    })
    expect([...result]).toEqual([obj2, obj3])
  })

  it('should work with boolean values', () => {
    const set = new Set([true, false, true, false])
    const result = filterSet(set, (value) => {
      return value === true
    })
    expect([...result]).toEqual([true])
  })

  it('should not mutate the original set', () => {
    const set = new Set([1, 2, 3, 4])
    const originalValues = [...set]
    filterSet(set, (value) => {
      return value > 2
    })
    expect([...set]).toEqual(originalValues)
  })

  it('should work with ReadonlySet', () => {
    const set: ReadonlySet<number> = new Set([1, 2, 3, 4, 5])
    const result = filterSet(set, (value) => {
      return value % 2 === 0
    })
    expect([...result]).toEqual([2, 4])
  })

  it('should maintain Set uniqueness', () => {
    const set = new Set([1, 2, 3, 4, 5])
    const result = filterSet(set, (value) => {
      return value > 0
    })
    expect(result.size).toBe(5)
    expect([...result]).toEqual([1, 2, 3, 4, 5])
  })

  it('should work with numeric predicates', () => {
    const set = new Set([10, 20, 30, 40, 50])
    const result = filterSet(set, (value) => {
      return value >= 30
    })
    expect([...result]).toEqual([30, 40, 50])
  })
})
