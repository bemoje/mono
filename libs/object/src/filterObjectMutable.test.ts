import { describe, it, expect, vi } from 'vitest'
import { filterObjectMutable } from './filterObjectMutable'

describe(filterObjectMutable.name, () => {
  it('should mutate the input object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = filterObjectMutable(obj, (value) => value > 1)
    expect(obj).toEqual(result) // Ensure it's mutated
  })

  it('filters properties based on the predicate function', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const predicate = (value: number) => value > 1
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({ b: 2, c: 3 })
  })

  it('works with objects with string values', () => {
    const obj = { a: 'apple', b: 'banana', c: 'cherry' }
    const predicate = (value: string) => value.startsWith('b')
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({ b: 'banana' })
  })

  it('works with an empty object', () => {
    const obj = {}
    const predicate = () => true // Always true
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({})
  })

  it('returns an empty object if no keys match the predicate', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const predicate = () => false // Always false
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({})
  })

  it('passes the correct arguments to the predicate function', () => {
    const obj = { a: 1 }
    const mockPredicate = vi.fn(() => true)
    filterObjectMutable(obj, mockPredicate)
    expect(mockPredicate).toHaveBeenCalledWith(1, 'a', obj)
  })

  it('handles objects with symbol keys', () => {
    const symKey = Symbol('key')
    const obj = { [symKey]: 42, a: 1 }
    const predicate = (value: number | symbol) => typeof value === 'number' && value > 10
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({ [symKey]: 42 })
  })
})
