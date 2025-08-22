import { strHashToString } from './strHashToString'
import { describe, expect, it } from 'vitest'

describe('strHashToString', () => {
  it('should hash a string into a buffer with a given algorithm and encoding', () => {
    const string = 'hello'
    const algorithm = 'sha256'
    const encoding = 'hex'
    const result = strHashToString(string, algorithm, encoding)
    const expected = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    expect(result).toEqual(expected)
  })
})
