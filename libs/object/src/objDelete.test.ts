import { describe, expect, it } from 'vitest'

import { objDelete } from './objDelete'

describe('objDelete', () => {
  it('should delete a property from an object and return the modified object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const key = 'b'
    const expected = { a: 1, c: 3 }
    expect(objDelete(obj, key)).toEqual(expected)
  })

  it('should handle symbol keys', () => {
    const key = Symbol('key')
    const obj = { [key]: 'value', b: 2 }
    const expected = { b: 2 }
    expect(objDelete(obj, key)).toEqual(expected)
  })

  it('should handle number keys', () => {
    const obj = { 1: 'a', 2: 'b', 3: 'c' }
    const key = 2
    const expected = { 1: 'a', 3: 'c' }
    expect(objDelete(obj, key)).toEqual(expected)
  })

  it('should mutate the object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const copy = { ...obj }
    objDelete(obj, 'b')
    expect(obj).not.toEqual(copy)
  })
})
