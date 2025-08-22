import { describe, expect, it } from 'vitest'

import { objOmitKeysMutable } from './objOmitKeysMutable'

describe(objOmitKeysMutable.name, () => {
  it('should delete specified keys from the object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = objOmitKeysMutable(obj, 'a', 'b')
    expect(result).toEqual({ c: 3 })
  })

  it('should return the same object if no keys are specified', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = objOmitKeysMutable(obj)
    expect(result).toEqual(obj)
  })

  it('should not throw an error if a specified key does not exist in the object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(() => objOmitKeysMutable(obj, 'd')).not.toThrow()
  })

  it('should handle an empty object', () => {
    const obj = {}
    const result = objOmitKeysMutable(obj, 'a')
    expect(result).toEqual({})
  })

  it('should handle null and undefined values in the object', () => {
    const obj = { a: null, b: undefined }
    const result = objOmitKeysMutable(obj, 'a')
    expect(result).toEqual({ b: undefined })
  })
})
