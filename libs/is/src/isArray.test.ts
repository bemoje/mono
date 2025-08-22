import { isArray } from './isArray'
import { describe, expect, it } from 'vitest'

describe(isArray.name, () => {
  it('should be Array.isArray', () => {
    expect(isArray).toBe(Array.isArray)
  })
})
