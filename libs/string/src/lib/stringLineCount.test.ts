import { describe, expect, it } from 'vitest'
import { stringLineCount } from './stringLineCount'

describe(stringLineCount.name, () => {
  it('should count number of lines in a string', () => {
    expect(stringLineCount('asda')).toBe(1)
    expect(stringLineCount('asda\nasd')).toBe(2)
  })
})
