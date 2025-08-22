import { round } from './round'
import { describe, expect, it } from 'vitest'

describe('round', () => {
  it('correctly rounds to nearest whole number', () => {
    expect(round(-1.1)).toBe(-1)
    expect(round(-0.1)).toBe(0)
    expect(round(0)).toBe(0)
    expect(round(0.1)).toBe(0)
    expect(round(0.9)).toBe(1)
  })
  it('correctly rounds with 1 decimal point', () => {
    expect(round(0.83, 1)).toBe(0.8)
    expect(round(0.87, 1)).toBe(0.9)
  })
  it('correctly rounds with 2 decimal point2', () => {
    expect(round(0.837, 2)).toBe(0.84)
    expect(round(0.833, 2)).toBe(0.83)
  })
})
