import { objSize } from './objSize'
import { describe, expect, it } from 'vitest'

describe('objSize', () => {
  it('should return 0 for an empty object', () => {
    const obj = {}
    expect(objSize(obj)).toBe(0)
  })

  it('should return the correct size for an object with multiple properties', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(objSize(obj)).toBe(3)
  })

  it('should return the correct size for an object with nested properties', () => {
    const obj = { a: { b: 2 }, c: 3 }
    expect(objSize(obj)).toBe(2)
  })

  it('should return the correct size for an object with number keys', () => {
    const obj = { 1: 'a', 2: 'b' }
    expect(objSize(obj)).toBe(2)
  })
})
