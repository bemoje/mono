import { describe, expect, it } from 'vitest'
import { arrTableToObjects } from './arrTableToObjects'

describe('arrTableToObjects', () => {
  it('without headers', () => {
    const table = [
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]
    expect(arrTableToObjects(table)).toEqual([
      { a: '1', b: '2', c: '3' },
      { a: '4', b: '5', c: '6' },
    ])
  })

  it('with headers', () => {
    const headers = ['a', 'b', 'c']
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]
    expect(arrTableToObjects(rows, headers)).toEqual([
      { a: '1', b: '2', c: '3' },
      { a: '4', b: '5', c: '6' },
    ])
  })

  it('should return an empty array if rows is empty and headers are provided', () => {
    const rows: any[][] = []
    const headers: string[] = ['Name', 'Age', 'Email']
    const result = arrTableToObjects(rows, headers)
    expect(result).toEqual([])
  })

  it('should return an empty array if rows has only one row and headers are not provided', () => {
    const rows: any[][] = [['John', 25, 'john@example.com']]
    const result = arrTableToObjects(rows)
    expect(result).toEqual([])
  })

  it('should return an array of objects with headers as keys and rows as values', () => {
    const rows: any[][] = [
      ['Name', 'Age', 'Email'],
      ['John', 25, 'john@example.com'],
      ['Jane', 30, 'jane@example.com'],
    ]
    const result = arrTableToObjects(rows)
    expect(result).toEqual([
      { Name: 'John', Age: 25, Email: 'john@example.com' },
      { Name: 'Jane', Age: 30, Email: 'jane@example.com' },
    ])
  })
})
