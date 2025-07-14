import { arrayToString } from './arrayToString'
import { describe, expect, it } from 'vitest'

describe(arrayToString.name, () => {
  it('string array', () => {
    expect(arrayToString(['no', 'yes', 'maybe'])).toBe('[no,yes,maybe]')
  })
  it('empty array', () => {
    expect(arrayToString([])).toBe('[]')
  })
  it('nested array', () => {
    expect(arrayToString([1, 2, ['2.a', '2.b', ['2.b.a'], '2.c'], 3])).toBe('[1,2,[2.a,2.b,[2.b.a],2.c],3]')
  })
})
