import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapObject } from './mapObject'

describe(mapObject.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { a: 1, b: 2, c: 3 }
      const doubled = mapObject(obj, (value) => {
        return value * 2
      })
      assert.deepStrictEqual(doubled, { a: 2, b: 4, c: 6 }, 'doubled values')
    }).not.toThrow()
  })

  it('should transform each value', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = mapObject(obj, (value) => {
      return value * 2
    })
    expect(result).toEqual({ a: 2, b: 4, c: 6 })
  })

  it('should handle empty object', () => {
    const result = mapObject({}, (value: number) => {
      return value
    })
    expect(result).toEqual({})
  })

  it('should support type transformation', () => {
    const obj = { a: 1, b: 2 }
    const result = mapObject(obj, (value) => {
      return String(value)
    })
    expect(result).toEqual({ a: '1', b: '2' })
  })

  it('should provide key to mapper', () => {
    const obj = { a: 1, b: 2 }
    const result = mapObject(obj, (value, key) => {
      return `${String(key)}:${value}`
    })
    expect(result).toEqual({ a: 'a:1', b: 'b:2' })
  })

  it('should not mutate original object', () => {
    const obj = { a: 1, b: 2 }
    const original = { ...obj }
    mapObject(obj, (value) => {
      return value * 2
    })
    expect(obj).toEqual(original)
  })
})
