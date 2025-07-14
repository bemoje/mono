import { describe, expect, it } from 'vitest'

import { iterableFirstElement } from './iterableFirstElement'

describe('iterableFirstElement', () => {
  it('should return the first element of an array', () => {
    const array = [1, 2, 3, 4, 5]
    const result = iterableFirstElement(array)
    expect(result).toBe(1)
  })

  it('should return the first element of a string', () => {
    const string = 'Hello'
    const result = iterableFirstElement(string)
    expect(result).toBe('H')
  })

  it('should return the first element of a Set', () => {
    const set = new Set(['apple', 'banana', 'cherry'])
    const result = iterableFirstElement(set)
    expect(result).toBe('apple')
  })

  it('should return the first element of a Map', () => {
    const map = new Map([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ])
    const result = iterableFirstElement(map)
    expect(result).toEqual([1, 'one'])
  })

  it('should return undefined for an empty array', () => {
    const array: number[] = []
    const result = iterableFirstElement(array)
    expect(result).toBeUndefined()
  })

  it('should return undefined for an empty string', () => {
    const string = ''
    const result = iterableFirstElement(string)
    expect(result).toBeUndefined()
  })

  it('should return undefined for an empty Set', () => {
    const set = new Set()
    const result = iterableFirstElement(set)
    expect(result).toBeUndefined()
  })

  it('should return undefined for an empty Map', () => {
    const map = new Map()
    const result = iterableFirstElement(map)
    expect(result).toBeUndefined()
  })
})
