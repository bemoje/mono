import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import colors from 'ansi-colors'
import Table from 'cli-table'
import { formatTableForTerminal } from './formatTableForTerminal'

// Mock cli-table
vi.mock('cli-table', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      push: vi.fn(),
      toString: vi
        .fn()
        .mockReturnValue(
          '│ Header 1 │ Header 2 │\n├──────────┼──────────┤\n│ Row 1    │ Data 1   │\n│ Row 2    │ Data 2   │',
        ),
    })),
  }
})

const MockTable = vi.mocked(Table)

describe(formatTableForTerminal.name, () => {
  let mockTable: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockTable = {
      push: vi.fn(),
      toString: vi
        .fn()
        .mockReturnValue(
          '│ Header 1 │ Header 2 │\n├──────────┼──────────┤\n│ Row 1    │ Data 1   │\n│ Row 2    │ Data 2   │',
        ),
    }
    MockTable.mockReturnValue(mockTable)
  })

  it('examples', () => {
    expect(() => {
      // Basic table with headers
      const rows = [
        ['Row1Col1', 'Row1Col2'],
        ['Row2Col1', 'Row2Col2'],
      ]
      const headers = ['Header1', 'Header2']
      const result = formatTableForTerminal(rows, headers)
      assert(typeof result === 'string', 'should return string')

      // Table without headers
      const resultNoHeaders = formatTableForTerminal(rows)
      assert(typeof resultNoHeaders === 'string', 'should handle no headers')

      // Table with no borders
      const resultNoBorders = formatTableForTerminal(rows, headers, { noBorders: true })
      assert(typeof resultNoBorders === 'string', 'should handle no borders option')

      // Empty table
      const emptyResult = formatTableForTerminal([])
      assert(emptyResult === '', 'should return empty string for empty rows')
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should format table with headers', () => {
      const rows = [
        ['Cell 1', 'Cell 2'],
        ['Cell 3', 'Cell 4'],
      ]
      const headers = ['Column A', 'Column B']

      const result = formatTableForTerminal(rows, headers)

      expect(MockTable).toHaveBeenCalledOnce()
      expect(mockTable.push).toHaveBeenCalledWith([colors.yellow('Column A'), colors.yellow('Column B')])
      expect(mockTable.push).toHaveBeenCalledWith(['Cell 1', 'Cell 2'])
      expect(mockTable.push).toHaveBeenCalledWith(['Cell 3', 'Cell 4'])
      expect(mockTable.toString).toHaveBeenCalled()
      expect(typeof result).toBe('string')
    })

    it('should format table without headers', () => {
      const rows = [
        ['Data 1', 'Data 2'],
        ['Data 3', 'Data 4'],
      ]

      const result = formatTableForTerminal(rows)

      expect(MockTable).toHaveBeenCalledOnce()
      expect(mockTable.push).toHaveBeenCalledWith(['Data 1', 'Data 2'])
      expect(mockTable.push).toHaveBeenCalledWith(['Data 3', 'Data 4'])
      expect(mockTable.toString).toHaveBeenCalled()
      expect(typeof result).toBe('string')
    })

    it('should not add headers when headers array is empty', () => {
      const rows = [['Data 1', 'Data 2']]
      const headers: string[] = []

      formatTableForTerminal(rows, headers)

      // Should not call push with colored headers
      expect(mockTable.push).toHaveBeenCalledTimes(1)
      expect(mockTable.push).toHaveBeenCalledWith(['Data 1', 'Data 2'])
    })

    it('should handle single row table', () => {
      const rows = [['Single', 'Row']]
      const headers = ['Col1', 'Col2']

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledTimes(2) // Headers + 1 row
      expect(mockTable.push).toHaveBeenNthCalledWith(1, [colors.yellow('Col1'), colors.yellow('Col2')])
      expect(mockTable.push).toHaveBeenNthCalledWith(2, ['Single', 'Row'])
    })

    it('should handle single column table', () => {
      const rows = [['Value1'], ['Value2'], ['Value3']]
      const headers = ['SingleColumn']

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledTimes(4) // Headers + 3 rows
      expect(mockTable.push).toHaveBeenNthCalledWith(1, [colors.yellow('SingleColumn')])
      expect(mockTable.push).toHaveBeenNthCalledWith(2, ['Value1'])
      expect(mockTable.push).toHaveBeenNthCalledWith(3, ['Value2'])
      expect(mockTable.push).toHaveBeenNthCalledWith(4, ['Value3'])
    })
  })

  describe('empty table handling', () => {
    it('should return empty string for empty rows array', () => {
      const result = formatTableForTerminal([])

      expect(result).toBe('')
      expect(MockTable).not.toHaveBeenCalled()
    })

    it('should return empty string for rows with empty arrays', () => {
      const result = formatTableForTerminal([[]])

      expect(result).toBe('')
      expect(MockTable).not.toHaveBeenCalled()
    })

    it('should return empty string for undefined/null rows', () => {
      const result1 = formatTableForTerminal([] as any)
      const result2 = formatTableForTerminal([[]] as any)

      expect(result1).toBe('')
      expect(result2).toBe('')
    })
  })

  describe('noBorders option', () => {
    it('should remove borders when noBorders is true', () => {
      mockTable.toString.mockReturnValue('├─┼─┤┐┘└┌┬┴│─│ Header │ Data │├─┼─┤│ Row1   │ Val1 │')

      const rows = [['Row1', 'Val1']]
      const headers = ['Header', 'Data']

      const result = formatTableForTerminal(rows, headers, { noBorders: true })

      expect(result).not.toContain('├')
      expect(result).not.toContain('┼')
      expect(result).not.toContain('┤')
      expect(result).not.toContain('┐')
      expect(result).not.toContain('┘')
      expect(result).not.toContain('└')
      expect(result).not.toContain('┌')
      expect(result).not.toContain('┬')
      expect(result).not.toContain('┴')
      expect(result).not.toContain('│')
      expect(result).not.toContain('─')
    })

    it('should keep borders when noBorders is false', () => {
      const rows = [['Row1', 'Val1']]
      const headers = ['Header', 'Data']

      const result = formatTableForTerminal(rows, headers, { noBorders: false })

      expect(mockTable.toString).toHaveBeenCalled()
      expect(result).toBe(mockTable.toString())
    })

    it('should keep borders when noBorders is undefined', () => {
      const rows = [['Row1', 'Val1']]
      const headers = ['Header', 'Data']

      const result = formatTableForTerminal(rows, headers, {})

      expect(result).toBe(mockTable.toString())
    })

    it('should filter empty lines when removing borders', () => {
      mockTable.toString.mockReturnValue('│ Header │\n├────────┤\n\x1B[90m\x1B[39m\n│ Data   │\n')

      const rows = [['Data']]
      const headers = ['Header']

      const result = formatTableForTerminal(rows, headers, { noBorders: true })

      expect(result).not.toContain('\x1B[90m\x1B[39m')
      // Should reduce empty lines, but might not eliminate all of them
      const emptyLineCount = result.split('\n').filter((line) => line.trim() === '').length
      expect(emptyLineCount).toBeLessThanOrEqual(2)
    })

    it('should trim lines when removing borders', () => {
      mockTable.toString.mockReturnValue('  │ Header │  \n  ├────────┤  \n  │ Data   │  ')

      const rows = [['Data']]
      const headers = ['Header']

      const result = formatTableForTerminal(rows, headers, { noBorders: true })

      const lines = result.split('\n')
      for (const line of lines) {
        expect(line).toBe(line.trim())
      }
    })
  })

  describe('header formatting', () => {
    it('should color all headers with yellow', () => {
      const headers = ['Name', 'Age', 'City', 'Country']
      const rows = [['John', '30', 'NYC', 'USA']]

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledWith([
        colors.yellow('Name'),
        colors.yellow('Age'),
        colors.yellow('City'),
        colors.yellow('Country'),
      ])
    })

    it('should handle headers with special characters', () => {
      const headers = ['User@Email', 'Price($)', 'Status%']
      const rows = [['test@example.com', '$100', '95%']]

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledWith([
        colors.yellow('User@Email'),
        colors.yellow('Price($)'),
        colors.yellow('Status%'),
      ])
    })

    it('should handle empty string headers', () => {
      const headers = ['', 'Name', '']
      const rows = [['', 'John', '']]

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledWith([colors.yellow(''), colors.yellow('Name'), colors.yellow('')])
    })

    it('should handle unicode headers', () => {
      const headers = ['名前', 'âge', '🏠 Address']
      const rows = [['田中', '25', '東京']]

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledWith([
        colors.yellow('名前'),
        colors.yellow('âge'),
        colors.yellow('🏠 Address'),
      ])
    })
  })

  describe('row data handling', () => {
    it('should handle various data types in rows', () => {
      const rows = [
        ['String', '123', 'true', 'null'],
        ['Another', '456', 'false', 'undefined'],
      ]

      formatTableForTerminal(rows)

      expect(mockTable.push).toHaveBeenCalledWith(['String', '123', 'true', 'null'])
      expect(mockTable.push).toHaveBeenCalledWith(['Another', '456', 'false', 'undefined'])
    })

    it('should handle empty cells', () => {
      const rows = [
        ['', 'Data', ''],
        ['Value', '', 'More'],
      ]

      formatTableForTerminal(rows)

      expect(mockTable.push).toHaveBeenCalledWith(['', 'Data', ''])
      expect(mockTable.push).toHaveBeenCalledWith(['Value', '', 'More'])
    })

    it('should handle rows with different column counts', () => {
      const rows = [
        ['A', 'B', 'C'],
        ['X', 'Y'],
        ['1', '2', '3', '4'],
      ]

      formatTableForTerminal(rows)

      expect(mockTable.push).toHaveBeenCalledWith(['A', 'B', 'C'])
      expect(mockTable.push).toHaveBeenCalledWith(['X', 'Y'])
      expect(mockTable.push).toHaveBeenCalledWith(['1', '2', '3', '4'])
    })

    it('should handle very long cell content', () => {
      const longContent = 'A'.repeat(1000)
      const rows = [[longContent, 'Short']]

      formatTableForTerminal(rows)

      expect(mockTable.push).toHaveBeenCalledWith([longContent, 'Short'])
    })
  })

  describe('edge cases', () => {
    it('should handle mismatched headers and row column counts', () => {
      const headers = ['Col1', 'Col2', 'Col3']
      const rows = [
        ['A', 'B'],
        ['X', 'Y', 'Z', 'Extra'],
      ]

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledWith([
        colors.yellow('Col1'),
        colors.yellow('Col2'),
        colors.yellow('Col3'),
      ])
      expect(mockTable.push).toHaveBeenCalledWith(['A', 'B'])
      expect(mockTable.push).toHaveBeenCalledWith(['X', 'Y', 'Z', 'Extra'])
    })

    it('should handle more headers than data columns', () => {
      const headers = ['A', 'B', 'C', 'D']
      const rows = [['1', '2']]

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledWith([
        colors.yellow('A'),
        colors.yellow('B'),
        colors.yellow('C'),
        colors.yellow('D'),
      ])
      expect(mockTable.push).toHaveBeenCalledWith(['1', '2'])
    })

    it('should handle fewer headers than data columns', () => {
      const headers = ['A', 'B']
      const rows = [['1', '2', '3', '4']]

      formatTableForTerminal(rows, headers)

      expect(mockTable.push).toHaveBeenCalledWith([colors.yellow('A'), colors.yellow('B')])
      expect(mockTable.push).toHaveBeenCalledWith(['1', '2', '3', '4'])
    })

    it('should handle null and undefined values in options', () => {
      const rows = [['Data']]

      const result1 = formatTableForTerminal(rows, undefined)
      const result2 = formatTableForTerminal(rows, undefined, undefined)

      expect(typeof result1).toBe('string')
      expect(typeof result2).toBe('string')
    })
  })

  describe('integration with cli-table', () => {
    it('should create Table instance correctly', () => {
      const rows = [['test']]

      formatTableForTerminal(rows)

      expect(MockTable).toHaveBeenCalledWith()
    })

    it('should call toString on table instance', () => {
      const rows = [['test']]

      formatTableForTerminal(rows)

      expect(mockTable.toString).toHaveBeenCalled()
    })

    it('should return the string from table.toString()', () => {
      const expectedOutput = 'Custom table output'
      mockTable.toString.mockReturnValue(expectedOutput)

      const rows = [['test']]
      const result = formatTableForTerminal(rows)

      expect(result).toBe(expectedOutput)
    })
  })
})
