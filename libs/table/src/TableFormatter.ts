import colors from 'ansi-colors'
import { NumberFormatter } from '@mono/number'
import { lazyProp } from '@mono/decorators'

/**
 * Options for @see formatTable
 */
export interface FormatTableOptions {
  /**
   * Whether to use colors in the output.
   * @default false
   */
  color?: boolean | Partial<FormatTableColors>

  /**
   * The string used to separate columns.
   * @default ' | '
   */
  columnSeparator?: string

  /**
   * The string used to separate the header row from the rest of the table.
   * @default '-'
   */
  headerRowSeparator?: string

  /**
   * An optional function that returns `true` if a row should be grayed out.
   */
  grayOutRow?: (row: (Primitive | Primitive[])[]) => boolean
}

/**
 * Formats a 2D array representing a table.
 */
export class TableFormatter {
  static readonly defaults: FormatTableOptionsMerged = {
    columnSeparator: ' | ',
    headerRowSeparator: '-',
    grayOutRow: undefined,
    color: {
      separator: colors.dim.gray,
      columnHeader: colors.cyan,
      rowHeader: (s: string) => s,
      string: colors.green,
      positiveNumber: colors.yellow,
      negativeNumber: colors.yellow,
      booleanTrue: colors.magenta,
      booleanFalse: colors.magenta,
    },
  }

  readonly table: (Primitive | Primitive[])[][]
  readonly options: FormatTableOptionsMerged

  constructor(table: (Primitive | Primitive[])[][], options?: FormatTableOptions) {
    this.table = table
    this.options = this.handleOptions(options)
  }

  @lazyProp
  get numberColumnPrecisions(): (number | undefined)[] {
    return this.table.reduce((acc: (number | undefined)[], row) => {
      return row.map((cell, c) => {
        if (typeof cell !== 'number') return undefined
        if (Number.isInteger(cell)) return 0
        const digits = cell.toString().split('.')[1].length
        return Math.max(acc[c] || 0, digits)
      })
    }, []) as (number | undefined)[]
  }

  @lazyProp
  get stringsTable(): string[][] {
    return this.table.map((row) => {
      return row.map((cell, c) => {
        return this.cellToString(cell, c)
      })
    })
  }

  @lazyProp
  get columnWidths(): number[] {
    return this.stringsTable.reduce((acc: number[], row) => {
      return row.map((cell, c) => {
        return Math.max(acc[c] || 0, cell.length)
      })
    }, [] as number[])
  }

  @lazyProp
  get tableWidth(): number {
    const separatorsWidth = (this.columnWidths.length - 1) * this.options.columnSeparator.length
    const columnsWidth = this.columnWidths.reduce((acc, width) => acc + width, 0)
    return columnsWidth + separatorsWidth
  }

  @lazyProp
  get columnSeparatorFormatted() {
    return this.options.color.separator(this.options.columnSeparator)
  }

  @lazyProp
  get headerRowSeparatorLineFormatted() {
    return this.options.color.separator(''.padEnd(this.tableWidth, this.options.headerRowSeparator))
  }

  @lazyProp
  get formattedRows(): string[][] {
    const result = this.stringsTable.map((row, r) => {
      return row.map((cell, c) => {
        return this.formatCell(cell, c, r)
      })
    })

    if (!this.options.color || !this.options.grayOutRow) {
      return result
    }

    return result.map((row, r) => {
      if (!this.options.grayOutRow!(this.table[r])) {
        return row
      }

      return row.map((cell) => {
        return this.options.color.separator(colors.stripColor(cell))
      })
    })
  }

  @lazyProp
  get formattedLines() {
    const lines = this.formattedRows.map((row) => row.join(this.columnSeparatorFormatted))
    lines.splice(1, 0, this.headerRowSeparatorLineFormatted)
    const headersLine = lines[0]
    lines.push(this.headerRowSeparatorLineFormatted)
    lines.push(headersLine)
    return lines
  }

  toString() {
    return this.formattedLines.join('\n')
  }

  protected handleOptions(options: FormatTableOptions = {}): FormatTableOptionsMerged {
    options = { ...options }
    if (!options.columnSeparator) options.columnSeparator = TableFormatter.defaults.columnSeparator
    if (!options.headerRowSeparator) options.headerRowSeparator = TableFormatter.defaults.headerRowSeparator
    options.color = !options.color
      ? defaultColorsNoop
      : options.color === true
        ? TableFormatter.defaults.color
        : { ...TableFormatter.defaults.color, ...options.color }
    return options as FormatTableOptionsMerged
  }

  protected cellToString(cell: Primitive | Primitive[], c: number) {
    if (cell == null) {
      return ''
    } else if (typeof cell === 'string') {
      return cell
    } else if (typeof cell === 'boolean') {
      return cell.toString()
    } else if (typeof cell === 'number') {
      return new NumberFormatter(this.numberColumnPrecisions[c] ?? 0).format(cell)
    } else if (Array.isArray(cell)) {
      return `[${cell.join(', ')}]`
    } else {
      throw new TypeError(`Unexpected cell value type: ${typeof cell}`)
    }
  }

  protected formatCell(cell: string, c: number, r: number): string {
    const originalCell = this.table[r][c]
    if (originalCell == null) {
      return this.formatNil(cell, c)
    } else if (typeof originalCell === 'string') {
      return this.formatString(cell, r, c)
    } else if (typeof originalCell === 'boolean') {
      return this.formatBoolean(cell, c)
    } else if (typeof originalCell === 'number') {
      return this.formatNumber(cell, originalCell, c)
    } else if (Array.isArray(originalCell)) {
      return this.formatString(cell, r, c)
    } else {
      throw new TypeError(`Unexpected cell value type: ${typeof originalCell}`)
    }
  }

  protected formatNil(cell: string, c: number) {
    return this.alignLeft(cell, c)
  }

  protected formatString(cell: string, r: number, c: number) {
    cell = this.alignLeft(cell, c)
    if (this.isColumnHeader(r)) return this.options.color.columnHeader(cell)
    if (this.isRowHeader(c)) return this.options.color.rowHeader(cell)
    return this.options.color.string(cell)
  }

  protected formatBoolean(cell: string, c: number) {
    cell = cell = this.alignLeft(cell, c)
    if (cell === 'true') return this.options.color.booleanTrue(cell)
    if (cell === 'false') return this.options.color.booleanFalse(cell)
    throw new Error(`Unexpected boolean representation: ${cell}`)
  }

  protected formatNumber(cell: string, originalCell: number | undefined, c: number) {
    cell = this.alignRight(cell, c)
    if ((originalCell ?? 0) < 0) return this.options.color.negativeNumber(cell)
    return this.options.color.positiveNumber(cell)
  }

  protected alignLeft(cell: string, c: number) {
    return cell.padEnd(this.columnWidths[c], ' ')
  }

  protected alignRight(cell: string, c: number) {
    return cell.padStart(this.columnWidths[c], ' ')
  }

  protected isColumnHeader(r: number) {
    return r === 0
  }

  protected isRowHeader(c: number) {
    return c === 0
  }
}

export interface FormatTableColors {
  separator: (s: string) => string
  columnHeader: (s: string) => string
  rowHeader: (s: string) => string
  string: (s: string) => string
  positiveNumber: (s: string) => string
  negativeNumber: (s: string) => string
  booleanTrue: (s: string) => string
  booleanFalse: (s: string) => string
}

interface FormatTableOptionsMerged {
  color: FormatTableColors
  columnSeparator: string
  headerRowSeparator: string
  grayOutRow?: (row: (Primitive | Primitive[])[]) => boolean
}

const defaultColorsNoop: FormatTableColors = {
  separator: (s: string) => s,
  columnHeader: (s: string) => s,
  rowHeader: (s: string) => s,
  string: (s: string) => s,
  positiveNumber: (s: string) => s,
  negativeNumber: (s: string) => s,
  booleanTrue: (s: string) => s,
  booleanFalse: (s: string) => s,
}

type Primitive = string | number | boolean | undefined | null
