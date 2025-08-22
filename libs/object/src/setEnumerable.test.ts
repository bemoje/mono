import { describe, expect, it } from 'vitest'

import { setEnumerable } from './setEnumerable'

describe('setEnumerable', () => {
  it('should set the enumerable property to true.', () => {
    const o = { a: 1 }
    Object.defineProperty(o, 'a', { enumerable: false })
    expect(Object.keys(o).includes('a')).toBe(false)
    setEnumerable(o, 'a')
    expect(Object.keys(o).includes('a')).toBe(true)
  })
})
