import { describe, expect, it } from 'vitest'

import { CreateObjectMerger } from './createObjectMerger'

describe(CreateObjectMerger.name, () => {
  it('should merge objects based on the predicate function', () => {
    const merge = CreateObjectMerger((value) => value != null)
    const target = { a: 1, b: 2, c: 3 }
    const source1 = { a: 5, b: null, c: undefined, d: 5 }
    const result = merge(target, source1)
    expect(result).toEqual({ a: 5, b: 2, c: 3, d: 5 })
  })
})
