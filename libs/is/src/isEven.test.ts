import { isEven } from './isEven'
import { describe, expect, it } from 'vitest'

describe('isEven', () => {
  it('correctly determines if natural number is even', () => {
    expect(isEven(-22)).toBe(true)
    expect(isEven(-21)).toBe(false)
    expect(isEven(-2)).toBe(true)
    expect(isEven(-1)).toBe(false)
    expect(isEven(0)).toBe(true)
    expect(isEven(1)).toBe(false)
    expect(isEven(2)).toBe(true)
    expect(isEven(21)).toBe(false)
    expect(isEven(22)).toBe(true)
  })
})
