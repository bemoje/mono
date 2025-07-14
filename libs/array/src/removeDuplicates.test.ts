import { describe, expect, it } from 'vitest'
import { removeDuplicates } from './removeDuplicates'

describe(removeDuplicates.name, () => {
  it('removes duplicates', () => {
    expect(removeDuplicates([1, 2, 3, 1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should remove duplicates from an array', () => {
    const input = [1, 2, 3, 2, 4, 1]
    const expectedOutput = [1, 2, 3, 4]
    const actual = removeDuplicates(input)
    expect(actual).toEqual(expectedOutput)
    expect(actual).not.toBe(input)
  })

  it('should return an empty array if the input array is empty', () => {
    const input: number[] = []
    const expectedOutput: number[] = []
    const actual = removeDuplicates(input)
    expect(actual).toEqual(expectedOutput)
    expect(actual).not.toBe(input)
  })

  it('should return the equal array if there are no duplicates', () => {
    const input = [1, 2, 3, 4]
    const expectedOutput = [1, 2, 3, 4]
    const actual = removeDuplicates(input)
    expect(actual).toEqual(expectedOutput)
    expect(actual).not.toBe(input)
  })
})
