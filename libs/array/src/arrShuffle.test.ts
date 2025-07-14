import { describe, expect, it } from 'vitest'
import { arrShuffle } from './arrShuffle'

describe('arrShuffle', () => {
  it('should guarantee shuffle the array in-place', () => {
    const input = [1, 2, 3, 4, 5]
    const original = input.slice()
    const shuffled = arrShuffle(input)
    expect(shuffled).toBe(input)
    expect(shuffled).not.toEqual(original)
  })

  it('should return the same array if it has only one element', () => {
    const input = [1]
    const original = input.slice()
    const shuffled = arrShuffle(input)
    expect(shuffled).toBe(input)
    expect(shuffled).toEqual(original)
  })

  it('should return an empty array if the input array is empty', () => {
    const input: number[] = []
    const original = input.slice()
    const shuffled = arrShuffle(input)
    expect(shuffled).toBe(input)
    expect(shuffled).toEqual(original)
  })
})
