import { describe, expect, it } from 'vitest'
import { arrTableRemoveColumns } from './arrTableRemoveColumns'

describe('arrTableRemoveColumns', () => {
  it('should return an empty array if the table is empty', () => {
    const table: string[][] = []
    const result = arrTableRemoveColumns(table, 'column1', 'column2')
    expect(result).toEqual([])
  })

  it('should return the original table if no columns are specified to be removed', () => {
    const table: string[][] = [
      ['column1', 'column2'],
      ['value1', 'value2'],
    ]
    const result = arrTableRemoveColumns(table)
    expect(result).toEqual(table)
  })

  it('should remove the left-most column', () => {
    const table = [
      ['Name', 'Age', 'Country'],
      ['John', '25', 'USA'],
      ['Jane', '30', 'Canada'],
      ['Mike', '35', 'Australia'],
    ]
    const expected = [
      ['Age', 'Country'],
      ['25', 'USA'],
      ['30', 'Canada'],
      ['35', 'Australia'],
    ]
    const result = arrTableRemoveColumns(table, 'Name')
    expect(result).toEqual(expected)
  })

  it('should remove the right-most column', () => {
    const table = [
      ['Name', 'Age', 'Country'],
      ['John', '25', 'USA'],
      ['Jane', '30', 'Canada'],
      ['Mike', '35', 'Australia'],
    ]
    const expected = [
      ['Name', 'Age'],
      ['John', '25'],
      ['Jane', '30'],
      ['Mike', '35'],
    ]
    const result = arrTableRemoveColumns(table, 'Country')
    expect(result).toEqual(expected)
  })

  it('should remove a center column', () => {
    const table = [
      ['Name', 'Age', 'Country'],
      ['John', '25', 'USA'],
      ['Jane', '30', 'Canada'],
      ['Mike', '35', 'Australia'],
    ]
    const expected = [
      ['Name', 'Country'],
      ['John', 'USA'],
      ['Jane', 'Canada'],
      ['Mike', 'Australia'],
    ]
    const result = arrTableRemoveColumns(table, 'Age')
    expect(result).toEqual(expected)
  })

  it('should remove multiple columns', () => {
    const table = [
      ['Name', 'Age', 'Country'],
      ['John', '25', 'USA'],
      ['Jane', '30', 'Canada'],
      ['Mike', '35', 'Australia'],
    ]

    const expected = [['Name'], ['John'], ['Jane'], ['Mike']]
    const result = arrTableRemoveColumns(table, 'Age', 'Country')
    expect(result).toEqual(expected)
  })

  it('should remove specified columns from a 2D array table with duplicate column names', () => {
    const table = [
      ['Name', 'Age', 'Country', 'Age'],
      ['John', '25', 'USA', '25'],
      ['Jane', '30', 'Canada', '30'],
      ['Mike', '35', 'Australia', '35'],
    ]

    const result = arrTableRemoveColumns(table, 'Age')

    expect(result).toEqual([
      ['Name', 'Country'],
      ['John', 'USA'],
      ['Jane', 'Canada'],
      ['Mike', 'Australia'],
    ])
  })
})
