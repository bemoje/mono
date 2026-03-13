import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterArray } from './filterArray'
import { it } from 'vitest'

describe(filterArray.name, () => {
  it('examples', () => {
    expect(() => {
      // filter numbers
      const numbers = [1, 2, 3, 4, 5]
      const evens = filterArray(numbers, (n) => {
        return n % 2 === 0
      })
      assert.deepStrictEqual(evens, [2, 4], 'filtered even numbers')

      // filter with index
      const withIndex = filterArray(numbers, (n, index) => {
        return index < 3
      })
      assert.deepStrictEqual(withIndex, [1, 2, 3], 'filtered by index')

      // empty result
      const empty = filterArray(numbers, () => {
        return false
      })
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should filter based on value predicate', () => {
    const array = [1, 2, 3, 4, 5, 6]
    const result = filterArray(array, (value) => {
      return value > 3
    })
    expect(result).toEqual([4, 5, 6])
  })

  it('should filter based on index predicate', () => {
    const array = ['a', 'b', 'c', 'd', 'e']
    const result = filterArray(array, (_, index) => {
      return index % 2 === 0
    })
    expect(result).toEqual(['a', 'c', 'e'])
  })

  it('should filter based on combined value and index predicate', () => {
    const array = [10, 20, 30, 40, 50]
    const result = filterArray(array, (value, index) => {
      return value > 20 && index < 4
    })
    expect(result).toEqual([30, 40])
  })

  it('should handle empty array', () => {
    const result = filterArray([], () => {
      return true
    })
    expect(result).toEqual([])
  })

  it('should return empty when no items match', () => {
    const array = [1, 2, 3]
    const result = filterArray(array, (value) => {
      return value > 10
    })
    expect(result).toEqual([])
  })

  it('should return all items when all match', () => {
    const array = [1, 2, 3]
    const result = filterArray(array, () => {
      return true
    })
    expect(result).toEqual([1, 2, 3])
  })

  it('should work with readonly arrays', () => {
    const array: readonly number[] = [1, 2, 3, 4]
    const result = filterArray(array, (value) => {
      return value % 2 === 0
    })
    expect(result).toEqual([2, 4])
  })

  it('should work with complex objects', () => {
    const array = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ]
    const result = filterArray(array, (item) => {
      return item.id > 1
    })
    expect(result).toEqual([
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
  })

  it('should not mutate the original array', () => {
    const array = [1, 2, 3, 4]
    const originalCopy = [...array]
    filterArray(array, (value) => {
      return value > 2
    })
    expect(array).toEqual(originalCopy)
  })
})
