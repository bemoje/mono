import { propertyIsEnumerable } from './propertyIsEnumerable'
import { describe, expect, it, vi } from 'vitest'

describe(propertyIsEnumerable.name, () => {
  it('should call Object.prototype.propertyIsEnumerable on the given object', () => {
    const spy = vi.spyOn(Object.prototype, 'propertyIsEnumerable')
    const obj = { a: 1 }
    expect(propertyIsEnumerable(obj, 'a')).toBe(true)
    expect(spy).toHaveBeenCalledWith('a')
  })
})
