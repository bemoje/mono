import { describe, expect, it } from 'vitest'
import { arrTableAssertRowsSameLength } from './arrTableAssertRowsSameLength'

describe('arrTableAssertRowsSameLength', () => {
  it('should throw an error if rows have different lengths', () => {
    const rows = [
      ['a', 'b', 'c'],
      ['d', 'e'],
    ]
    expect(() => arrTableAssertRowsSameLength(rows)).toThrow()
  })

  it('should not throw an error if all rows have the same length', () => {
    const rows = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ]
    expect(() => arrTableAssertRowsSameLength(rows)).not.toThrow()
  })

  it('should not throw an error if all rows have the same length', () => {
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    expect(() => arrTableAssertRowsSameLength(rows)).not.toThrow()
  })

  it('should throw an error if any row has a different length', () => {
    const rowsWithDifferentLength = [
      [1, 2, 3],
      [4, 5],
      [7, 8, 9],
    ]
    expect(() => arrTableAssertRowsSameLength(rowsWithDifferentLength)).toThrowError('Expected 3 columns, got 2')
  })

  it('should throw an error with custom headers if any row has a different length', () => {
    const rowsWithDifferentLength = [
      [1, 2, 3],
      [4, 5],
      [7, 8, 9],
    ]
    const headers = ['A', 'B', 'C']
    expect(() => arrTableAssertRowsSameLength(rowsWithDifferentLength, headers)).toThrowError(
      'Expected 3 columns, got 2',
    )
  })

  it('should not throw an error if all rows have the same length as the custom headers', () => {
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    const headers = ['A', 'B', 'C']
    expect(() => arrTableAssertRowsSameLength(rows, headers)).not.toThrow()
  })
})
