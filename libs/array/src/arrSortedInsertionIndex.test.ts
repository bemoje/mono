import { describe, expect, it } from 'vitest'
import { arrSortedInsertionIndex } from './arrSortedInsertionIndex'

describe(arrSortedInsertionIndex.name, () => {
  it('should return 0 if the array is empty', () => {
    const array: number[] = []
    const value = 10
    const comparator = (a: number, b: number) => a - b
    expect(arrSortedInsertionIndex(array, value, comparator)).toBe(0)
  })

  it('should return 0 if the value is smaller than the smallest element in the array', () => {
    const array = [5, 10, 15]
    const value = 2
    const comparator = (a: number, b: number) => a - b
    expect(arrSortedInsertionIndex(array, value, comparator)).toBe(0)
  })

  it('should return the first index if the value is equal to the first element in the array', () => {
    const array = [5, 10, 15]
    const value = 5
    const comparator = (a: number, b: number) => a - b
    expect(arrSortedInsertionIndex(array, value, comparator)).toBe(1)
  })

  it('should return the index of the first instance if the value is present multiple times in the array', () => {
    const array = [5, 5, 10, 15]
    const value = 5
    const comparator = (a: number, b: number) => a - b
    expect(arrSortedInsertionIndex(array, value, comparator)).toBe(2)
  })

  it('should return the index where the value should be inserted to maintain a sorted order', () => {
    const array = [5, 10, 15]
    const value = 12
    const comparator = (a: number, b: number) => a - b
    expect(arrSortedInsertionIndex(array, value, comparator)).toBe(2)
  })

  it('should return the index where the value should be inserted to maintain a sorted order (string array)', () => {
    const array = ['apple', 'banana', 'orange']
    const value = 'cherry'
    const comparator = (a: string, b: string) => a.localeCompare(b)
    expect(arrSortedInsertionIndex(array, value, comparator)).toBe(2)
  })

  it('should return the index where the value should be inserted to maintain a sorted order (case insensitive)', () => {
    const array = ['Apple', 'banana', 'orange']
    const value = 'apple'
    const comparator = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' })
    expect(arrSortedInsertionIndex(array, value, comparator)).toBe(1)
  })
})
