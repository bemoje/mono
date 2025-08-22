import { describe, expect, it } from 'vitest'
import { setNonEnumerable } from './setNonEnumerable'

describe(setNonEnumerable.name, () => {
  it('should set the enumerable property to false.', () => {
    const o = { a: 1 }
    expect(Object.keys(o).includes('a')).toBe(true)
    setNonEnumerable(o, 'a')
    expect(Object.keys(o).includes('a')).toBe(false)
  })
})
