import { arrTableEachToString } from './arrTableEachToString'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe('arrTableEachToString', () => {
  it('should convert each value of a 2D array to string', () => {
    const table = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    const expected = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
    ]
    const result = arrTableEachToString(table)
    expect(result).toEqual(expected)
  })

  it('should return an empty array if the input table is empty', () => {
    const table: number[][] = []
    const expected: string[][] = []
    const result = arrTableEachToString(table)
    expect(result).toEqual(expected)
  })

  it('should handle a table with empty arrays', () => {
    const table: number[][] = [[], [], []]
    const expected: string[][] = [[], [], []]
    const result = arrTableEachToString(table)
    expect(result).toEqual(expected)
  })

  it('should handle a table with arrays of different lengths', () => {
    const table: number[][] = [
      [1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
    ]
    const expected: string[][] = [
      ['1', '2'],
      ['3', '4', '5'],
      ['6', '7', '8', '9'],
    ]
    const result = arrTableEachToString(table)
    expect(result).toEqual(expected)
  })

  it('should convert undefined values to empty strings', () => {
    const table = [
      [1, undefined, 3],
      [undefined, 5, undefined],
    ]
    const expected = [
      ['1', '', '3'],
      ['', '5', ''],
    ]
    const result = arrTableEachToString(table)
    expect(result).toEqual(expected)
  })
})
