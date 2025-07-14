import { isPosIntRange } from './isPosIntRange'
import { describe, expect, it } from 'vitest'

describe(isPosIntRange.name, () => {
  it('valid', () => {
    expect(isPosIntRange([1, 2])).toBe(true)
    expect(isPosIntRange([1, 1])).toBe(true)
  })
  describe('invalid', () => {
    it('negative', () => {
      expect(isPosIntRange([-1, 0])).toBe(false)
    })
    it('not ascending', () => {
      expect(isPosIntRange([2, 1])).toBe(false)
    })
    it('length not 2', () => {
      expect(isPosIntRange([1, 2, 3])).toBe(false)
      expect(isPosIntRange([1])).toBe(false)
    })
  })
})
