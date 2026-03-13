import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapSet } from './mapSet'

describe(mapSet.name, () => {
  it('examples', () => {
    expect(() => {
      const set = new Set([1, 2, 3, 4, 5])
      const doubled = mapSet(set, (n) => {
        return n * 2
      })
      assert.deepStrictEqual([...doubled], [2, 4, 6, 8, 10], 'doubled numbers')
    }).not.toThrow()
  })

  it('should transform each value', () => {
    const set = new Set([1, 2, 3, 4, 5])
    const result = mapSet(set, (value) => {
      return value * 2
    })
    expect([...result]).toEqual([2, 4, 6, 8, 10])
  })

  it('should handle empty set', () => {
    const result = mapSet(new Set<number>(), (value) => {
      return value
    })
    expect([...result]).toEqual([])
  })

  it('should support type transformation', () => {
    const set = new Set([1, 2, 3])
    const result = mapSet(set, (value) => {
      return String(value)
    })
    expect([...result]).toEqual(['1', '2', '3'])
  })

  it('should work with ReadonlySet', () => {
    const set: ReadonlySet<number> = new Set([1, 2, 3])
    const result = mapSet(set, (value) => {
      return value * 2
    })
    expect([...result]).toEqual([2, 4, 6])
  })

  it('should not mutate original set', () => {
    const set = new Set([1, 2, 3])
    const original = [...set]
    mapSet(set, (value) => {
      return value * 2
    })
    expect([...set]).toEqual(original)
  })

  it('should maintain uniqueness', () => {
    const set = new Set([1, 2, 3])
    const result = mapSet(set, () => {
      return 1
    })
    expect(result.size).toBe(1)
    expect([...result]).toEqual([1])
  })
})
