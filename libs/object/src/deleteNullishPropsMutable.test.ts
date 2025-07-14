import { describe, it, expect } from 'vitest'
import { deleteNullishPropsMutable } from './deleteNullishPropsMutable'

describe(deleteNullishPropsMutable.name, () => {
  it('should remove properties with null values', () => {
    const obj = { a: 1, b: null, c: 'test' }
    const result = deleteNullishPropsMutable(obj)
    expect(result).toEqual({ a: 1, c: 'test' })
  })

  it('should remove properties with undefined values', () => {
    const obj = { a: 1, b: undefined, c: 'test' }
    const result = deleteNullishPropsMutable(obj)
    expect(result).toEqual({ a: 1, c: 'test' })
  })

  it('should remove properties with both null and undefined values', () => {
    const obj = { a: 1, b: null, c: undefined, d: 'test' }
    const result = deleteNullishPropsMutable(obj)
    expect(result).toEqual({ a: 1, d: 'test' })
  })

  it('should not remove properties with non-null and non-undefined values', () => {
    const obj = { a: 1, b: 0, c: false, d: '', e: 'test' }
    const result = deleteNullishPropsMutable(obj)
    expect(result).toEqual({ a: 1, b: 0, c: false, d: '', e: 'test' })
  })

  it('should return an empty object if all properties are null or undefined', () => {
    const obj = { a: null, b: undefined }
    const result = deleteNullishPropsMutable(obj)
    expect(result).toEqual({})
  })

  it('should not modify the original object structure', () => {
    const obj = { a: 1, b: null, c: 'test' }
    const result = deleteNullishPropsMutable(obj)
    expect(result).toBe(obj)
  })
})
