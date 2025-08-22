import { describe, expect, it } from 'vitest'
import { arrSum } from './arrSum'

describe('arrSum', () => {
  it('should return 0 for an empty array', () => {
    expect(arrSum([])).toBe(0)
  })

  it('should return the sum of positive numbers', () => {
    expect(arrSum([1, 2, 3])).toBe(6)
  })

  it('should return the sum of negative numbers', () => {
    expect(arrSum([-1, -2, -3])).toBe(-6)
  })

  it('should return the sum of positive and negative numbers', () => {
    expect(arrSum([-1, 2, -3])).toBe(-2)
  })

  it('should return the sum of decimal numbers', () => {
    expect(arrSum([1.5, 2.5, 3.5])).toBe(7.5)
  })

  it('should return the sum of large numbers', () => {
    expect(arrSum([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])).toBe(Number.MAX_SAFE_INTEGER * 2)
  })
})
