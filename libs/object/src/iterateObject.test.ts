import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { iterateObject } from './iterateObject'

describe(iterateObject.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { a: { b: 1 }, c: [2, { d: 3 }] }
      const paths = []
      for (const o of iterateObject(obj)) {
        if (o.isLeaf) paths.push([o.propertyPath, o.value])
      }
      assert.deepStrictEqual(paths, [
        ['a.b', 1],
        ['c[0]', 2],
        ['c[1].d', 3],
      ])
    }).not.toThrow()
  })

  it('should handle nested objects and arrays', () => {
    const obj = { a: { b: [1, { c: 2 }] } }
    const values = []
    for (const o of iterateObject(obj)) {
      if (o.isLeaf) values.push(o.value)
    }
    expect(values).toEqual([1, 2])
  })

  it('should handle circular references', () => {
    const obj: any = { a: 1 }
    obj.self = obj
    const values = []
    for (const o of iterateObject(obj)) {
      if (o.isLeaf) values.push(o.value)
    }
    expect(values).toEqual([1])
  })
})
