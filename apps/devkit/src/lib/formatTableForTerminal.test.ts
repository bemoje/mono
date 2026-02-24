import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { formatTableForTerminal } from './formatTableForTerminal'

describe(formatTableForTerminal.name, () => {
  it('should return empty string for empty rows', () => {
    expect(formatTableForTerminal([])).toBe('')
  })

  it('should return empty string for rows with empty arrays', () => {
    expect(formatTableForTerminal([[]])).toBe('')
  })

  it('should format rows without headers', () => {
    const result = formatTableForTerminal([
      ['a', 'b'],
      ['c', 'd'],
    ])
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(result).toContain('a')
    expect(result).toContain('d')
  })

  it('should format rows with headers', () => {
    const result = formatTableForTerminal(
      [
        ['1', '2'],
        ['3', '4'],
      ],
      ['Col1', 'Col2'],
    )
    expect(result).toContain('Col1')
    expect(result).toContain('Col2')
    expect(result).toContain('1')
  })

  it('should support noBorders option', () => {
    const withBorders = formatTableForTerminal([['a', 'b']])
    const noBorders = formatTableForTerminal([['a', 'b']], undefined, { noBorders: true })
    // noBorders version should not contain box-drawing characters
    expect(noBorders).not.toMatch(/[├┼┤┐┘└┌┬┴│─]/)
    expect(withBorders.length).not.toBe(noBorders.length)
  })
})
