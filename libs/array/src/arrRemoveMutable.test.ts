import { describe, expect, it } from 'vitest'
import { arrRemoveMutable } from './arrRemoveMutable'

describe('arrRemoveMutable', () => {
  it('removes an element when it is present in the array', () => {
    const array = [1, 2, 3, 4]
    arrRemoveMutable(array, 3)
    expect(array).toEqual([1, 2, 4])
  })

  it('does nothing if the element is not in the array', () => {
    const array = [1, 2, 3, 4]
    arrRemoveMutable(array, 5)
    expect(array).toEqual([1, 2, 3, 4])
  })

  it('works with an array of strings', () => {
    const array = ['a', 'b', 'c', 'd']
    arrRemoveMutable(array, 'c')
    expect(array).toEqual(['a', 'b', 'd'])
  })

  it('returns an empty array when given an empty array', () => {
    const array: number[] = []
    arrRemoveMutable(array, 1)
    expect(array).toEqual([])
  })

  it('removes all occurrences of the element', () => {
    const array = [1, 2, 3, 3, 4, 3]
    arrRemoveMutable(array, 3)
    expect(array).toEqual([1, 2, 4])
  })
})
