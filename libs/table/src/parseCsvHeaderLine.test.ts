import { describe, expect, it } from 'vitest'
import { parseCsvHeaderLine } from './parseCsvHeaderLine'

describe('parseCsvHeaderLine', () => {
  it('should parse a CSV header line with default delimiter', () => {
    const headerLine = 'name;age;city'
    const expected = ['name', 'age', 'city']
    const result = parseCsvHeaderLine(headerLine)
    expect(result).toEqual(expected)
  })

  it('should parse a CSV header line with custom delimiter', () => {
    const headerLine = 'name,age,city'
    const delimiter = ','
    const expected = ['name', 'age', 'city']
    const result = parseCsvHeaderLine(headerLine, delimiter)
    expect(result).toEqual(expected)
  })

  it('should parse a CSV header line with double quotes', () => {
    const headerLine = '"name";"age";"city"'
    const expected = ['name', 'age', 'city']
    const result = parseCsvHeaderLine(headerLine)
    expect(result).toEqual(expected)
  })

  it('should parse a CSV header line with double quotes and custom delimiter', () => {
    const headerLine = '"name","age","city"'
    const delimiter = ','
    const expected = ['name', 'age', 'city']
    const result = parseCsvHeaderLine(headerLine, delimiter)
    expect(result).toEqual(expected)
  })
})
