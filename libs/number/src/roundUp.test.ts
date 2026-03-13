import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { roundUp } from './roundUp'

describe('roundUp', () => {
  it('correctly rounds up number', () => {
    expect(roundUp(-1.1)).toBe(-1)
    expect(roundUp(-0.1)).toBe(0)
    expect(roundUp(0)).toBe(0)
    expect(roundUp(0.1)).toBe(1)
    expect(roundUp(1.9)).toBe(2)
  })
})
