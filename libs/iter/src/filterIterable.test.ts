import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterIterable } from './filterIterable'
import { it } from 'vitest'

describe(filterIterable.name, () => {
  it('should filter an iterable', () => {
    const values = [1, 2, 3, 4]
    const result = [
      ...filterIterable(values, (v) => {
        return v % 2 === 0
      }),
    ]
    expect(result).toEqual([2, 4])
  })

  it('should handle empty iterable', () => {
    const result = [
      ...filterIterable([], () => {
        return true
      }),
    ]
    expect(result).toEqual([])
  })
})
