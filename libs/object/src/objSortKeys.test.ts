import { objSortKeys } from './objSortKeys'
import { describe, expect, it } from 'vitest'

describe('objSortKeys', () => {
  it('should return a new object with keys sorted in ascending order', () => {
    const obj = { b: 2, a: 1, c: 3 }
    const sortedObj = objSortKeys(obj)
    expect(Object.keys(sortedObj)).toEqual(['a', 'b', 'c'])
    expect(sortedObj).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should not mutate the original object', () => {
    const obj = { b: 2, a: 1, c: 3 }
    const sortedObj = objSortKeys(obj)
    expect(obj).toEqual({ b: 2, a: 1, c: 3 })
    expect(sortedObj).not.toBe(obj)
  })

  it('should handle an empty object', () => {
    const obj = {}
    const sortedObj = objSortKeys(obj)
    expect(sortedObj).toEqual({})
  })

  it('should handle an object with one key', () => {
    const obj = { a: 1 }
    const sortedObj = objSortKeys(obj)
    expect(sortedObj).toEqual({ a: 1 })
  })

  it('should handle an object with keys of different types', () => {
    const obj = { '2': 'two', '1': 'one', '3': 'three' }
    const sortedObj = objSortKeys(obj)
    expect(Object.keys(sortedObj)).toEqual(['1', '2', '3'])
    expect(sortedObj).toEqual({ '1': 'one', '2': 'two', '3': 'three' })
  })
})
