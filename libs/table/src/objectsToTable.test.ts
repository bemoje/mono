import { objectsToTable } from './objectsToTable'
import { describe, it, expect } from 'vitest'

describe('objectsToTable', () => {
  it('should convert an array of objects to a table with default headers', () => {
    const objects = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]
    const expectedTable = [
      ['age', 'name'],
      [30, 'John'],
      [25, 'Jane'],
    ]
    const result = objectsToTable(objects)
    expect(result).toEqual(expectedTable)
  })

  it('should convert an array of objects to a table with custom headers', () => {
    const objects = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]
    const headers = ['name', 'age']
    const expectedTable = [
      ['name', 'age'],
      ['John', 30],
      ['Jane', 25],
    ]
    const result = objectsToTable(objects, headers)
    expect(result).toEqual(expectedTable)
  })

  it('should handle objects with missing properties', () => {
    const objects = [{ name: 'John', age: 30 }, { name: 'Jane' }]
    const expectedTable = [
      ['age', 'name'],
      [30, 'John'],
      ['', 'Jane'],
    ]
    const result = objectsToTable(objects)
    expect(result).toEqual(expectedTable)
  })

  it('should handle empty objects', () => {
    const objects: Record<string, unknown>[] = []
    const expectedTable: string[][] = [[]]
    const result = objectsToTable(objects)
    expect(result).toEqual(expectedTable)
  })
})
