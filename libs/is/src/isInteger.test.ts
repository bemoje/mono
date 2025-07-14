import { isInteger } from './isInteger'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(isInteger.name, () => {
  it('examples', () => {
    expect(() => {
      assert.strictEqual(isInteger(5), true)
      assert.strictEqual(isInteger(5.5), false)
    }).not.toThrow()
  })

  it('should return true for integer values', () => {
    expect(isInteger(0)).toBe(true)
    expect(isInteger(1)).toBe(true)
    expect(isInteger(-1)).toBe(true)
    expect(isInteger(1234567890)).toBe(true)
  })

  it('should return false for non-integer values', () => {
    expect(isInteger(0.1)).toBe(false)
    expect(isInteger(-0.1)).toBe(false)
    expect(isInteger(Math.PI)).toBe(false)
  })

  it('should return false for NaN', () => {
    expect(isInteger(NaN)).toBe(false)
  })

  it('should return false for Infinity', () => {
    expect(isInteger(Infinity)).toBe(false)
    expect(isInteger(-Infinity)).toBe(false)
  })
})
