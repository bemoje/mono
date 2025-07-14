import { describe, expect, it } from 'vitest'
import { countFloatDecimals } from './countFloatDecimals'

describe(countFloatDecimals.name, () => {
  it('should return 0 for invalid values', () => {
    expect(countFloatDecimals(NaN)).toBe(0)
    expect(countFloatDecimals(Infinity)).toBe(0)
    expect(countFloatDecimals(-Infinity)).toBe(0)
    expect(countFloatDecimals(null as never)).toBe(0)
    expect(countFloatDecimals(undefined as never)).toBe(0)
    expect(countFloatDecimals('' as never)).toBe(0)
  })
  it('should return 0 for integers', () => {
    expect(countFloatDecimals(0)).toBe(0)
    expect(countFloatDecimals(1)).toBe(0)
    expect(countFloatDecimals(1234)).toBe(0)
  })

  it('should return the correct number of decimal places for floats', () => {
    expect(countFloatDecimals(0.0)).toBe(0)
    expect(countFloatDecimals(0.1)).toBe(1)
    expect(countFloatDecimals(0.123456)).toBe(6)
    expect(countFloatDecimals(1.123456)).toBe(6)
    expect(countFloatDecimals(1234.123456)).toBe(6)
    expect(countFloatDecimals(1234.123456)).toBe(6)
    expect(countFloatDecimals(2 / 6)).toBe(16)
  })

  it('should ignore excess zeros', () => {
    expect(countFloatDecimals(0.12)).toBe(2)
    expect(countFloatDecimals(0.12)).toBe(2)
  })
})
