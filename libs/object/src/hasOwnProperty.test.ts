import { describe, expect, it } from 'vitest'
import { hasOwnProperty } from './hasOwnProperty'

describe(hasOwnProperty.name, () => {
  it('should return true if the object has the specified property', () => {
    const obj = { name: 'John', age: 30 }
    expect(hasOwnProperty(obj, 'name')).toBe(true)
    expect(hasOwnProperty(obj, 'age')).toBe(true)
  })

  it('should return false if the object does not have the specified property', () => {
    const obj = { name: 'John', age: 30 }
    expect(hasOwnProperty(obj, 'city')).toBe(false)
    expect(hasOwnProperty(obj, 'gender')).toBe(false)
  })
})
