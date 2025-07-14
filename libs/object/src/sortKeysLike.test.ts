import { describe, it, expect } from 'vitest'
import { sortKeysLike } from './sortKeysLike'

describe(sortKeysLike.name, () => {
  it('sorts keys of an object based on the given order', () => {
    const obj = { a: 1, b: 2, c: 3 }

    const result = sortKeysLike(obj, ['c', 'a', 'b'])

    expect(result).toEqual({ c: 3, a: 1, b: 2 })
  })

  it('handles objects with keys in a different order', () => {
    const obj = { x: 10, y: 20, z: 30 }

    const result = sortKeysLike(obj, ['z', 'x', 'y'])

    expect(result).toEqual({ z: 30, x: 10, y: 20 })
  })

  it('returns an empty object when no keys are specified', () => {
    const obj = { p: 42, q: 84 }
    const orderedKeys: (keyof typeof obj)[] = []

    const result = sortKeysLike(obj, orderedKeys)

    expect(result).toEqual({})
  })

  it('maintains type safety with strict types', () => {
    const obj = { alpha: 'A', beta: 'B' }
    const orderedKeys: ('beta' | 'alpha')[] = ['beta', 'alpha']

    const result = sortKeysLike(obj, orderedKeys)

    expect(result).toEqual({ beta: 'B', alpha: 'A' })
  })
})
