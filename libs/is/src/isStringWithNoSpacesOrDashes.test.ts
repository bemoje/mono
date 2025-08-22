import { isStringWithNoSpacesOrDashes } from './isStringWithNoSpacesOrDashes'
import { describe, expect, it } from 'vitest'

describe(isStringWithNoSpacesOrDashes.name, () => {
  it('should return true if the value is a string with no spaces or dashes', () => {
    expect(isStringWithNoSpacesOrDashes('hello')).toBe(true)
    expect(isStringWithNoSpacesOrDashes('helloworld')).toBe(true)
    expect(isStringWithNoSpacesOrDashes('hello123')).toBe(true)
  })

  it('should return false if the value is not a string', () => {
    expect(isStringWithNoSpacesOrDashes(123)).toBe(false)
    expect(isStringWithNoSpacesOrDashes(true)).toBe(false)
    expect(isStringWithNoSpacesOrDashes(null)).toBe(false)
    expect(isStringWithNoSpacesOrDashes(undefined)).toBe(false)
    expect(isStringWithNoSpacesOrDashes({})).toBe(false)
    expect(isStringWithNoSpacesOrDashes([])).toBe(false)
  })

  it('should return false if the value is a string with spaces', () => {
    expect(isStringWithNoSpacesOrDashes('hello world')).toBe(false)
    expect(isStringWithNoSpacesOrDashes('hello world 123')).toBe(false)
  })

  it('should return false if the value is a string with dashes', () => {
    expect(isStringWithNoSpacesOrDashes('hello-world')).toBe(false)
    expect(isStringWithNoSpacesOrDashes('hello-world-123')).toBe(false)
  })
})
