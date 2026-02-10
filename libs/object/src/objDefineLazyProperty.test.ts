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

  it('should use the setter before the getter has been called', () => {
    const object: { y?: number } = {}
    let called = false

    objDefineLazyProperty(object, 'y', () => {
      called = true
      return 42
    })

    // Set before getting - triggers the descriptor setter, NOT the getter
    object.y = 99
    expect(object.y).toBe(99)
    expect(called).toBe(false)
  })
})
