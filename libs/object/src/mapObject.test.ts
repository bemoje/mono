import { describe, it, expect } from 'vitest'
import { mapObject } from './mapObject'
import { mapObjectEntries } from './mapObjectEntries'
import { mapObjectKeys } from './mapObjectKeys'

describe(mapObject.name, () => {
  it('should map over the object values and apply the transformation', () => {
    const input = { a: 1, b: 2, c: 3 }
    const result = mapObject(input, (value, key) => `${key}:${value * 2}`)
    expect(result).toEqual({ a: 'a:2', b: 'b:4', c: 'c:6' })
  })

  it('should return an empty object if input is empty', () => {
    const result = mapObject({}, () => 42)
    expect(result).toEqual({})
  })
})

describe(mapObjectKeys.name, () => {
  it('should map over the object keys and apply the transformation', () => {
    const input = { a: 1, b: 2 }
    const result = mapObjectKeys(input, (key, value) => `${key}${value}`)
    expect(result).toEqual({ a1: 1, b2: 2 })
  })

  it('should handle empty objects gracefully', () => {
    const result = mapObjectKeys({}, (key) => key)
    expect(result).toEqual({})
  })
})

describe(mapObjectEntries.name, () => {
  it('should map over the entries of an object and return transformed entries', () => {
    const input = { a: 1, b: 2 }
    const result = mapObjectEntries(input, (key, value) => [`${key}_mapped`, value * 10])
    expect(result).toEqual({ a_mapped: 10, b_mapped: 20 })
  })

  it('should handle empty objects gracefully', () => {
    const result = mapObjectEntries({}, (key, value) => [key, value])
    expect(result).toEqual({})
  })
})
