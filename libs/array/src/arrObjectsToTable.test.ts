import { describe, expect, it } from 'vitest'
import { arrObjectsToTable } from './arrObjectsToTable'

describe('arrObjectsToTable', () => {
  it('should convert an array of objects to a two-dimensional table', () => {
    const objects = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]
    const options: any = {
      headers: ['name', 'age'],
      emptyCell: -1,
    }
    const expectedTable = [
      ['name', 'age'],
      ['John', 25],
      ['Jane', 30],
    ]
    const table = arrObjectsToTable(objects, options)
    expect(table).toEqual(expectedTable)
  })

  it('should use unique keys as headers if no headers are provided', () => {
    const objects = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]
    const expectedTable = [
      ['name', 'age'],
      ['John', 25],
      ['Jane', 30],
    ]
    const table = arrObjectsToTable(objects)
    expect(table).toEqual(expectedTable)
  })

  it('should use empty string as default empty cell value', () => {
    const objects = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]
    const options: any = {
      headers: ['name', 'age'],
    }
    const expectedTable = [
      ['name', 'age'],
      ['John', 25],
      ['Jane', 30],
    ]
    const table = arrObjectsToTable(objects, options)
    expect(table).toEqual(expectedTable)
  })

  it('should use empty cell value from options if provided', () => {
    const objects = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
    ]
    const options: any = {
      headers: ['name', 'age'],
      emptyCell: -1,
    }
    const expectedTable = [
      ['name', 'age'],
      ['John', 25],
      ['Jane', 30],
    ]
    const table = arrObjectsToTable(objects, options)
    expect(table).toEqual(expectedTable)
  })

  it('should handle objects with missing properties', () => {
    const objects = [{ name: 'John', age: 25 }, { name: 'Jane' }]
    const options: any = {
      headers: ['name', 'age'],
      emptyCell: -1,
    }
    const expectedTable = [
      ['name', 'age'],
      ['John', 25],
      ['Jane', -1],
    ]
    const table = arrObjectsToTable(objects, options)
    expect(table).toEqual(expectedTable)
  })

  it('should handle empty objects', () => {
    const objects = [{ name: 'John', age: 25 }, {}]
    const options: any = {
      headers: ['name', 'age'],
      emptyCell: -1,
    }
    const expectedTable = [
      ['name', 'age'],
      ['John', 25],
      [-1, -1],
    ]
    const table = arrObjectsToTable(objects, options)
    expect(table).toEqual(expectedTable)
  })

  it('should handle empty arrays', () => {
    const objects: Record<string, number | undefined>[] = []
    const options: any = {
      headers: ['name', 'age'],
      emptyCell: -1,
    }
    const expectedTable = [['name', 'age']]
    const table = arrObjectsToTable(objects, options)
    expect(table).toEqual(expectedTable)
  })
})
