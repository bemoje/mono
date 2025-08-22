import { describe, expect, it } from 'vitest'
import { arrRemove } from './arrRemove'

describe('arrRemove', () => {
  it('removes an element when it is present in the array', () => {
    const array = [1, 2, 3, 4]
    const result = arrRemove(array, 3)
    expect(result).toEqual([1, 2, 4])
  })

  it('does nothing if the element is not in the array', () => {
    const array = [1, 2, 3, 4]
    const result = arrRemove(array, 5)
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('works with an array of strings', () => {
    const array = ['a', 'b', 'c', 'd']
    const result = arrRemove(array, 'c')
    expect(result).toEqual(['a', 'b', 'd'])
  })

  it('returns an empty array when given an empty array', () => {
    const array: number[] = []
    const result = arrRemove(array, 1)
    expect(result).toEqual([])
  })

  it('does not mutate the original array', () => {
    const array = [1, 2, 3, 4]
    arrRemove(array, 3)
    expect(array).toEqual([1, 2, 3, 4])
  })
})
