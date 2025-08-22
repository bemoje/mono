import { describe, expect, it } from 'vitest'
import { arrSortNumeric } from './arrSortNumeric'

describe('arrSortNumeric', () => {
  it('example', () => {
    expect(arrSortNumeric([4, 5, 1, 1.5, 11])).toStrictEqual([1, 1.5, 4, 5, 11])
    expect([4, 5, 1, 1.5, 11].sort()).not.toStrictEqual([1, 1.5, 4, 5, 11])
  })

  it('should return an empty array if the input is empty', () => {
    const input: Array<number | bigint | boolean> = []
    const result = arrSortNumeric(input)
    expect(result).toEqual([])
  })

  it('should return the same array if the input has only one element', () => {
    const input: Array<number | bigint | boolean> = [5]
    const result = arrSortNumeric(input)
    expect(result).toEqual([5])
  })

  it('should sort an array of numbers in ascending order', () => {
    const input: Array<number | bigint | boolean> = [5, 2, 8, 1, 3]
    const result = arrSortNumeric(input)
    expect(result).toEqual([1, 2, 3, 5, 8])
  })

  it('should sort an array of bigints in ascending order', () => {
    const input: Array<number | bigint | boolean> = [BigInt(5), BigInt(2), BigInt(8), BigInt(1), BigInt(3)]
    const result = arrSortNumeric(input)
    expect(result).toEqual([BigInt(1), BigInt(2), BigInt(3), BigInt(5), BigInt(8)])
  })

  it('should sort an array of booleans in ascending order', () => {
    const input: Array<number | bigint | boolean> = [true, false, true, false]
    const result = arrSortNumeric(input)
    expect(result).toEqual([false, false, true, true])
  })

  it('should sort an array of mixed types in ascending order', () => {
    const input: Array<number | bigint | boolean> = [5, BigInt(2), true, 1, false]
    const result = arrSortNumeric(input)
    expect(result).toEqual([false, true, 1, BigInt(2), 5])
  })
})
