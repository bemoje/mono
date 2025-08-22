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
})
