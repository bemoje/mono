import { strIsMultiLine } from './strIsMultiLine'
import { describe, expect, it } from 'vitest'

describe('strIsMultiLine', () => {
  it('should return true if the string contains multiple lines', () => {
    const multiLineString = 'Hello\nWorld'
    expect(strIsMultiLine(multiLineString)).toBe(true)
  })

  it('should return false if the string does not contain multiple lines', () => {
    const singleLineString = 'Hello World'
    expect(strIsMultiLine(singleLineString)).toBe(false)
  })

  it('should return false if the string is empty', () => {
    const emptyString = ''
    expect(strIsMultiLine(emptyString)).toBe(false)
  })

  it('should return true if the string contains only a newline character', () => {
    const newlineString = '\n'
    expect(strIsMultiLine(newlineString)).toBe(true)
  })

  it('should return true if the string contains multiple newline characters', () => {
    const multiNewlineString = '\n\n\n'
    expect(strIsMultiLine(multiNewlineString)).toBe(true)
  })
})
