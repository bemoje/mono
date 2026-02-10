import { describe, expect, it } from 'vitest'
import { TableFormatter } from './TableFormatter'

describe(TableFormatter.name, () => {
  it('should render basic table', () => {
    const table = new TableFormatter([
      ['Name', 'Age', 'Present'],
      ['Alice', 30, 'true'],
      ['Bob', 25, 'false'],
    ])
    const expected = [
      'Name  | Age | Present',
      '---------------------',
      'Alice |  30 | true   ',
      'Bob   |  25 | false  ',
      '---------------------',
      'Name  | Age | Present',
    ].join('\n')
    const actual = table.toString()
    expect(actual).toBe(expected)
  })

  it('should handle floating point numbers', () => {
    const table = new TableFormatter([
      ['Item', 'Price'],
      ['Apple', 1.5],
      ['Banana', 2.75],
    ])
    const expected = [
      'Item   | Price',
      '--------------',
      'Apple  |  1.50',
      'Banana |  2.75',
      '--------------',
      'Item   | Price',
    ].join('\n')
    const actual = table.toString()
    expect(actual).toBe(expected)
  })

  it('should handle boolean cells', () => {
    const table = new TableFormatter([
      ['Name', 'Active'],
      ['Alice', true],
      ['Bob', false],
    ])
    const actual = table.toString()
    expect(actual).toContain('true ')
    expect(actual).toContain('false')
  })

  it('should handle null and undefined cells', () => {
    const table = new TableFormatter([
      ['Name', 'Value'],
      ['Alice', null],
      ['Bob', undefined],
    ])
    const actual = table.toString()
    expect(actual).toContain('Alice')
    expect(actual).toContain('Bob')
  })

  it('should handle array cells', () => {
    const table = new TableFormatter([
      ['Name', 'Tags'],
      ['Alice', ['a', 'b']],
    ])
    const actual = table.toString()
    expect(actual).toContain('[a, b]')
  })

  it('should handle negative numbers', () => {
    const table = new TableFormatter([
      ['Name', 'Balance'],
      ['Alice', -100],
      ['Bob', 50],
    ])
    const actual = table.toString()
    expect(actual).toContain('-100')
    expect(actual).toContain('50')
  })

  it('should handle color: true option', () => {
    const table = new TableFormatter(
      [
        ['Name', 'Age'],
        ['Alice', 30],
      ],
      { color: true },
    )
    const actual = table.toString()
    expect(actual).toBeDefined()
    expect(actual.length).toBeGreaterThan(0)
  })

  it('should handle partial color option', () => {
    const table = new TableFormatter(
      [
        ['Name', 'Age'],
        ['Alice', 30],
      ],
      { color: { separator: (s: string) => `[${s}]` } },
    )
    const actual = table.toString()
    expect(actual).toBeDefined()
  })

  it('should handle grayOutRow option with color', () => {
    const table = new TableFormatter(
      [
        ['Name', 'Age'],
        ['Alice', 30],
        ['Bob', 25],
      ],
      {
        color: true,
        grayOutRow: (row) => row[0] === 'Bob',
      },
    )
    const actual = table.toString()
    expect(actual).toBeDefined()
    expect(actual.length).toBeGreaterThan(0)
  })

  it('should handle grayOutRow returning false for all rows', () => {
    const table = new TableFormatter(
      [
        ['Name', 'Age'],
        ['Alice', 30],
      ],
      {
        color: true,
        grayOutRow: () => false,
      },
    )
    const actual = table.toString()
    expect(actual).toBeDefined()
  })

  it('should handle custom column separator', () => {
    const table = new TableFormatter(
      [
        ['A', 'B'],
        ['1', '2'],
      ],
      { columnSeparator: ' - ' },
    )
    const actual = table.toString()
    expect(actual).toContain(' - ')
  })

  it('should handle custom header row separator', () => {
    const table = new TableFormatter(
      [
        ['A', 'B'],
        ['1', '2'],
      ],
      { headerRowSeparator: '=' },
    )
    const actual = table.toString()
    expect(actual).toContain('=====')
  })

  it('should throw on unexpected cell value type in cellToString', () => {
    const table = new TableFormatter([
      ['Name', 'Value'],
      ['Alice', Symbol('test') as never],
    ])
    expect(() => table.toString()).toThrow('Unexpected cell value type')
  })

  it('should handle negative float numbers', () => {
    const table = new TableFormatter([
      ['Name', 'Balance'],
      ['Alice', -1.5],
      ['Bob', 2.75],
    ])
    const actual = table.toString()
    expect(actual).toContain('-1.50')
    expect(actual).toContain('2.75')
  })
})
