import { strEnsureStartsWith } from './strEnsureStartsWith'
import { describe, expect, it } from 'vitest'

describe('strEnsureStartsWith', () => {
  it('should return the original string if it already starts with the specified substring', () => {
    const result = strEnsureStartsWith('.json', '.')
    expect(result).toBe('.json')
  })

  it('should prepend the specified substring to the start of the string if it does not already start with it', () => {
    const result = strEnsureStartsWith('json', '.')
    expect(result).toBe('.json')
  })
})
