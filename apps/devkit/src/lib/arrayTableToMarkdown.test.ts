import { describe, expect, it } from 'vitest'
import { arrayTableToMarkdown } from './arrayTableToMarkdown'

describe(arrayTableToMarkdown.name, () => {
  it('should convert a simple table to markdown', () => {
    const table = [
      ['Name', 'Age'],
      ['Alice', '30'],
      ['Bob', '25'],
    ]
    const result = arrayTableToMarkdown(table)
    expect(result).toBe(['| Name  | Age |', '| ----- | --- |', '| Alice | 30  |', '| Bob   | 25  |'].join('\n'))
  })

  it('should pad cells to equal column widths', () => {
    const table = [
      ['A', 'LongerHeader'],
      ['Short', 'B'],
    ]
    const result = arrayTableToMarkdown(table)
    const lines = result.split('\n')
    expect(lines[0]).toBe('| A     | LongerHeader |')
    expect(lines[1]).toBe('| ----- | ------------ |')
    expect(lines[2]).toBe('| Short | B            |')
  })

  it('should handle a single-row table (header only)', () => {
    const table = [['Col1', 'Col2']]
    const result = arrayTableToMarkdown(table)
    expect(result).toBe(['| Col1 | Col2 |', '| ---- | ---- |'].join('\n'))
  })

  it('should handle a single-column table', () => {
    const table = [['Header'], ['Value']]
    const result = arrayTableToMarkdown(table)
    expect(result).toBe(['| Header |', '| ------ |', '| Value  |'].join('\n'))
  })

  it('should throw on empty table', () => {
    expect(() => arrayTableToMarkdown([])).toThrow('Invalid table')
  })

  it('should throw on rows with mismatched column counts', () => {
    const table = [
      ['A', 'B'],
      ['C', 'D', 'E'],
    ]
    expect(() => arrayTableToMarkdown(table)).toThrow('Invalid table')
  })
})
