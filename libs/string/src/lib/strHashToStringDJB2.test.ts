import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { strHashToStringDJB2 } from './strHashToStringDJB2'

describe(strHashToStringDJB2.name, () => {
  it('should return a numeric hash', () => {
    expect(typeof strHashToStringDJB2('hello')).toBe('number')
  })

  it('should return consistent hashes for the same input', () => {
    expect(strHashToStringDJB2('test')).toBe(strHashToStringDJB2('test'))
  })

  it('should return different hashes for different inputs', () => {
    expect(strHashToStringDJB2('abc')).not.toBe(strHashToStringDJB2('xyz'))
  })

  it('should handle empty string', () => {
    expect(strHashToStringDJB2('')).toBe(5381)
  })
})
