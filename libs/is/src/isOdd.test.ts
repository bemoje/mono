import { isOdd } from './isOdd'
import { describe, expect, it } from 'vitest'

describe('isOdd', () => {
  it('correctly determines if natural number is even', () => {
    expect(isOdd(-22)).toBe(false)
    expect(isOdd(-21)).toBe(true)
    expect(isOdd(-2)).toBe(false)
    expect(isOdd(-1)).toBe(true)
    expect(isOdd(0)).toBe(false)
    expect(isOdd(1)).toBe(true)
    expect(isOdd(2)).toBe(false)
    expect(isOdd(21)).toBe(true)
    expect(isOdd(22)).toBe(false)
  })
})
