import { describe, expect, it } from 'vitest'
import { arrSwap } from './arrSwap'

describe('arrSwap', () => {
  it('example', () => {
    expect(arrSwap([1, 2, 3, 4], 1, 2)).toStrictEqual([1, 3, 2, 4])
  })

  it('should swap two elements in the array', () => {
    const input = [1, 2, 3, 4, 5]
    const expected = [1, 4, 3, 2, 5]
    const result = arrSwap(input, 1, 3)
    expect(result).toEqual(expected)
  })

  it('should return the same array if the indices are the same', () => {
    const input = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4, 5]
    const result = arrSwap(input, 2, 2)
    expect(result).toEqual(expected)
  })
})
