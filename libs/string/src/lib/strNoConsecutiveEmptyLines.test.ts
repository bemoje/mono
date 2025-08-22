import { strNoConsecutiveEmptyLines } from './strNoConsecutiveEmptyLines'
import { describe, expect, it } from 'vitest'

describe('strNoConsecutiveEmptyLines', () => {
  it('should remove consecutive empty lines', () => {
    const code = `line1

line2

line3`
    const expected = `line1

line2

line3`
    expect(strNoConsecutiveEmptyLines(code)).toBe(expected)
  })

  it('should not remove single empty lines', () => {
    const code = `line1

line2

line3`
    expect(strNoConsecutiveEmptyLines(code)).toBe(code)
  })

  it('should return the same string if there are no empty lines', () => {
    const code = `line1
line2
line3`
    expect(strNoConsecutiveEmptyLines(code)).toBe(code)
  })

  it('should return an empty string if the input is an empty string', () => {
    const code = ''
    expect(strNoConsecutiveEmptyLines(code)).toBe(code)
  })

  it('should handle strings with only empty lines', () => {
    const code = `

`
    const expected = `

`
    expect(strNoConsecutiveEmptyLines(code)).toBe(expected)
  })
})
