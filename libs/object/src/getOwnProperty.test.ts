import { describe, expect, it } from 'vitest'
import { getOwnProperty } from './getOwnProperty'

describe(getOwnProperty.name, () => {
  const obj = { age: 30 }
  const func = function a() {}

  it('should return the value if the object has the specified own property', () => {
    expect(getOwnProperty(obj, 'age')).toBe(30)
  })

  it('should return undefined if the object does not have the specified own property', () => {
    expect(getOwnProperty(obj, 'unknown')).toBeUndefined()
    expect(getOwnProperty(func, 'unknown')).toBeUndefined()
  })
  it('should return undefined if the property is not an own, but prototype property', () => {
    expect(obj.toString).toBeDefined()
    expect(getOwnProperty(func, 'toString')).toBeUndefined()

    expect(func.toString).toBeDefined()
    expect(getOwnProperty(obj, 'toString')).toBeUndefined()
  })
})
