import { describe, it, expect } from 'vitest'
import { sortKeys } from './sortKeys'

describe(sortKeys.name, () => {
  it('should sort the keys of an object alphabetically by default', () => {
    const input = { c: 3, a: 1, b: 2 }
    const output = sortKeys(input)
    expect(output).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should use the provided compare function to sort keys', () => {
    const input = { c: 3, a: 1, b: 2 }
    const output = sortKeys(input, (a, b) => b.localeCompare(a)) // Descending order
    expect(output).toEqual({ c: 3, b: 2, a: 1 })
  })

  it('should return an empty object when input is empty', () => {
    const input = {}
    const output = sortKeys(input)
    expect(output).toEqual({})
  })

  it('should work with objects with non-string values', () => {
    const input = { a: [1, 2, 3], b: { nested: true }, c: 42 }
    const output = sortKeys(input)
    expect(output).toEqual({ a: [1, 2, 3], b: { nested: true }, c: 42 })
  })

  it('should not mutate the original object', () => {
    const input = { c: 3, a: 1, b: 2 }
    const copy = { ...input }
    sortKeys(input)
    expect(input).toEqual(copy)
  })

  it('should maintain types of nested objects after sorting', () => {
    const input = { c: { d: 4 }, a: { b: 2 } }
    const output = sortKeys(input)
    expect(output).toEqual({ a: { b: 2 }, c: { d: 4 } })
  })
})
