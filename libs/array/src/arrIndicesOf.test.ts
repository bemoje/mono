import { describe, expect, it } from 'vitest'
import { arrIndicesOf } from './arrIndicesOf'

describe('arrIndicesOf', () => {
  it('example', () => {
    const arr = ['a', 'b', 'c', 'a']
    expect(arrIndicesOf(arr, 'a')).toStrictEqual([0, 3])
    expect(arrIndicesOf(arr, 'b')).toStrictEqual([1])
    expect(arrIndicesOf(arr, 'd')).toStrictEqual([])
  })

  it('should return an empty array if the input array is empty', () => {
    const inputArray: number[] = []
    const elementToFind = 2
    const result = arrIndicesOf(inputArray, elementToFind)
    expect(result).toEqual([])
  })

  it('should return an empty array if the element is not found in the input array', () => {
    const inputArray = [1, 2, 3, 4, 5]
    const elementToFind = 6
    const result = arrIndicesOf(inputArray, elementToFind)
    expect(result).toEqual([])
  })

  it('should return an array with the indexes of the element in the input array', () => {
    const inputArray = [1, 2, 3, 2, 4, 2, 5]
    const elementToFind = 2
    const result = arrIndicesOf(inputArray, elementToFind)
    expect(result).toEqual([1, 3, 5])
  })
})
