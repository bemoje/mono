import { numRange } from './numRange'
import { describe, expect, it } from 'vitest'

describe(numRange.name, () => {
  it('should return an array of numbers from start to end, inclusive', () => {
    expect(numRange(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(numRange(-2, 2)).toEqual([-2, -1, 0, 1, 2])
    expect(numRange(0, 0)).toEqual([0])
  })
})
