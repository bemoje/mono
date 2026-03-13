import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { roundDown } from './roundDown'

describe('roundDown', () => {
  it('correctly rounds down number', () => {
    expect(roundDown(-1.1)).toBe(-2)
    expect(roundDown(-0.1)).toBe(-1)
    expect(roundDown(0)).toBe(0)
    expect(roundDown(0.1)).toBe(0)
    expect(roundDown(1.9)).toBe(1)
  })
})
