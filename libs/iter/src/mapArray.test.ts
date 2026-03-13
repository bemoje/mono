import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapArray } from './mapArray'

describe(mapArray.name, () => {
  it('examples', () => {
    expect(() => {
      // transform numbers
      const numbers = [1, 2, 3, 4, 5]
      const doubled = mapArray(numbers, (n) => {
        return n * 2
      })
      assert.deepStrictEqual(doubled, [2, 4, 6, 8, 10], 'doubled numbers')

      // with index
      const withIndex = mapArray(numbers, (n, index) => {
        return `${index}:${n}`
      })
      assert.deepStrictEqual(withIndex, ['0:1', '1:2', '2:3', '3:4', '4:5'], 'with index')
    }).not.toThrow()
  })

  it('should transform each element', () => {
    const array = [1, 2, 3, 4, 5]
    const result = mapArray(array, (value) => {
      return value * 2
    })
    expect(result).toEqual([2, 4, 6, 8, 10])
  })

  it('should provide index to mapper', () => {
    const array = ['a', 'b', 'c']
    const result = mapArray(array, (value, index) => {
      return `${index}:${value}`
    })
    expect(result).toEqual(['0:a', '1:b', '2:c'])
  })

  it('should handle empty array', () => {
    const result = mapArray([], (value) => {
      return value
    })
    expect(result).toEqual([])
  })

  it('should work with readonly arrays', () => {
    const array: readonly number[] = [1, 2, 3]
    const result = mapArray(array, (value) => {
      return value * 2
    })
    expect(result).toEqual([2, 4, 6])
  })

  it('should transform to different type', () => {
    const array = [1, 2, 3]
    const result = mapArray(array, (value) => {
      return String(value)
    })
    expect(result).toEqual(['1', '2', '3'])
  })

  it('should work with complex objects', () => {
    const array = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const result = mapArray(array, (item) => {
      return item.name
    })
    expect(result).toEqual(['Alice', 'Bob'])
  })

  it('should not mutate original array', () => {
    const array = [1, 2, 3]
    const original = [...array]
    mapArray(array, (value) => {
      return value * 2
    })
    expect(array).toEqual(original)
  })
})
