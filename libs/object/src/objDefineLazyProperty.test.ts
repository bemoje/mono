import { describe, expect, it } from 'vitest'

import { objDefineLazyProperty } from './objDefineLazyProperty'

describe(objDefineLazyProperty.name, () => {
  it('sets property', () => {
    const object: { x?: string } = {}
    let index = 0

    objDefineLazyProperty(object, 'x', () => {
      index++
      return 'foo'
    })

    expect(object.x).toBe('foo')
    expect(object.x).toBe('foo')
    expect(index).toBe(1)

    object.x = 'bar'
    expect(object.x).toBe('bar')
    expect(index).toBe(1)
  })
})
