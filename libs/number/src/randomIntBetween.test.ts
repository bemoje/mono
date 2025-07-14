import { randomIntBetween } from './randomIntBetween'
import { describe, expect, it } from 'vitest'

describe('randomIntBetween', () => {
  it('generates correct random integers', () => {
    for (let i = -10; i < 10; i++) {
      for (let j = i; j < 10; j++) {
        const r = randomIntBetween(i, j)
        expect(r >= i).toBe(true)
        expect(r <= j).toBe(true)
      }
    }
  })
})
