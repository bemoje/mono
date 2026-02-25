import { arrTableAssertRowsSameLength } from './arrTableAssertRowsSameLength'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe('arrTableAssertRowsSameLength', () => {
  it('should throw an error if rows have different lengths', () => {
    const rows = [
      ['a', 'b', 'c'],
      ['d', 'e'],
    ]
    expect(() => {
      return arrTableAssertRowsSameLength(rows)
    }).toThrow()
  })

  it('should not throw an error if all rows have the same length', () => {
    const rows = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ]
    expect(() => {
      return arrTableAssertRowsSameLength(rows)
    }).not.toThrow()
  })

  it('should not throw an error if all rows have the same length', () => {
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    expect(() => {
      return arrTableAssertRowsSameLength(rows)
    }).not.toThrow()
  })

  it('should throw an error if any row has a different length', () => {
    const rowsWithDifferentLength = [
      [1, 2, 3],
      [4, 5],
      [7, 8, 9],
    ]
    expect(() => {
      return arrTableAssertRowsSameLength(rowsWithDifferentLength)
    }).toThrowError('Expected 3 columns, got 2')
  })

  it('should throw an error with custom headers if any row has a different length', () => {
    const rowsWithDifferentLength = [
      [1, 2, 3],
      [4, 5],
      [7, 8, 9],
    ]
    const headers = ['A', 'B', 'C']
    expect(() => {
      return arrTableAssertRowsSameLength(rowsWithDifferentLength, headers)
    }).toThrowError('Expected 3 columns, got 2')
  })

  it('should not throw an error if all rows have the same length as the custom headers', () => {
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    const headers = ['A', 'B', 'C']
    expect(() => {
      return arrTableAssertRowsSameLength(rows, headers)
    }).not.toThrow()
  })
})
