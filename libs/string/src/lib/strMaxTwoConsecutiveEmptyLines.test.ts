import { strMaxTwoConsecutiveEmptyLines } from './strMaxTwoConsecutiveEmptyLines'
import { describe, expect, it } from 'vitest'

describe(strMaxTwoConsecutiveEmptyLines.name, () => {
  it('does nothing if max not exceeded', () => {
    expect(strMaxTwoConsecutiveEmptyLines('a\nb')).toBe('a\nb')
    expect(strMaxTwoConsecutiveEmptyLines('a\n\nb')).toBe('a\n\nb')
    expect(strMaxTwoConsecutiveEmptyLines('a\n\n\nb')).toBe('a\n\n\nb')
    expect(strMaxTwoConsecutiveEmptyLines('\n\n\na\n\n\nb\n\n\n')).toBe('\n\n\na\n\n\nb\n\n\n')
  })
  it('enforces max when exceeded', () => {
    expect(strMaxTwoConsecutiveEmptyLines('a\n\n\n\nb')).toBe('a\n\n\nb')
    expect(strMaxTwoConsecutiveEmptyLines('a\n\n\n\n\nb')).toBe('a\n\n\nb')
  })
  it('enforces max when exceeded anywhere in string', () => {
    expect(strMaxTwoConsecutiveEmptyLines('\n\na\n\n\n\nb')).toBe('\n\na\n\n\nb')
    expect(strMaxTwoConsecutiveEmptyLines('a\n\n\n\n\nb\n\n')).toBe('a\n\n\nb\n\n')
  })
})
