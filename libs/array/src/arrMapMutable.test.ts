import { describe, expect, it } from 'vitest'
import { arrMapMutable } from './arrMapMutable'

describe('arrMapMutable', () => {
  it('example', () => {
    const a = [1, 2, 3, 4, 5]
    arrMapMutable(a, (value: number) => {
      return value + 1
    })
    expect(a).toStrictEqual([2, 3, 4, 5, 6])
  })

  it('should return an array with each element incremented by 1', () => {
    const input = [1, 2, 3, 4, 5]
    const expected = [2, 3, 4, 5, 6]
    const result = arrMapMutable(input, (value: number) => value + 1)
    expect(result).toEqual(expected)
  })

  it('should return the same array if the iterator does not modify the elements', () => {
    const input = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4, 5]
    const result = arrMapMutable(input, (value: number) => value)
    expect(result).toEqual(expected)
  })

  it('should return an empty array if the input array is empty', () => {
    const input: number[] = []
    const expected: number[] = []
    const result = arrMapMutable(input, (value: number) => value)
    expect(result).toEqual(expected)
  })

  it('should modify the input array in place', () => {
    const input = [1, 2, 3, 4, 5]
    const expected = [2, 3, 4, 5, 6]
    arrMapMutable(input, (value: number) => value + 1)
    expect(input).toEqual(expected)
  })
})
