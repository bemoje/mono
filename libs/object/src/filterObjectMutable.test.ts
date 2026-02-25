import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterObjectMutable } from './filterObjectMutable'
import { it } from 'vitest'
import { vi } from 'vitest'

describe(filterObjectMutable.name, () => {
  it('should mutate the input object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = filterObjectMutable(obj, (value) => {
      return value > 1
    })
    expect(obj).toEqual(result) // Ensure it's mutated
  })

  it('filters properties based on the predicate function', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const predicate = (value: number) => {
      return value > 1
    }
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({ b: 2, c: 3 })
  })

  it('works with objects with string values', () => {
    const obj = { a: 'apple', b: 'banana', c: 'cherry' }
    const predicate = (value: string) => {
      return value.startsWith('b')
    }
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({ b: 'banana' })
  })

  it('works with an empty object', () => {
    const obj = {}
    const predicate = () => {
      return true
    } // Always true
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({})
  })

  it('returns an empty object if no keys match the predicate', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const predicate = () => {
      return false
    } // Always false
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({})
  })

  it('passes the correct arguments to the predicate function', () => {
    const obj = { a: 1 }
    const mockPredicate = vi.fn(() => {
      return true
    })
    filterObjectMutable(obj, mockPredicate)
    expect(mockPredicate).toHaveBeenCalledWith(1, 'a', obj)
  })

  it('handles objects with symbol keys', () => {
    const symKey = Symbol('key')
    const obj = { [symKey]: 42, a: 1 }
    const predicate = (value: number | symbol) => {
      return typeof value === 'number' && value > 10
    }
    const result = filterObjectMutable(obj, predicate)
    expect(result).toEqual({ [symKey]: 42 })
  })
})
