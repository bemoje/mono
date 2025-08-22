import { isObjectType } from './isObjectType'
import { describe, expect, it } from 'vitest'

describe(isObjectType.name, () => {
  it('should return true for an object', () => {
    expect(isObjectType({})).toBe(true)
    expect(isObjectType({ key: 'value' })).toBe(true)
  })

  it('should return false for null', () => {
    expect(isObjectType(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isObjectType(undefined)).toBe(false)
  })

  it('should return false for a number', () => {
    expect(isObjectType(123)).toBe(false)
  })

  it('should return false for a string', () => {
    expect(isObjectType('test')).toBe(false)
  })

  it('should return false for a boolean', () => {
    expect(isObjectType(true)).toBe(false)
    expect(isObjectType(false)).toBe(false)
  })

  it('should return true for an array', () => {
    expect(isObjectType([])).toBe(true)
    expect(isObjectType([1, 2, 3])).toBe(true)
  })

  it('should return false for a function', () => {
    expect(isObjectType(() => 1)).toBe(false)
  })

  it('should be true when the value is an object.', function () {
    expect(isObjectType({})).toBe(true)
    expect(isObjectType(Object.create({}))).toBe(true)
    expect(isObjectType(Object.create(Object.prototype))).toBe(true)
    expect(isObjectType(Object.create(null))).toBe(true)
    expect(isObjectType(/foo/)).toBe(true)
    expect(isObjectType(new (class Foo {})())).toBe(true)
    expect(isObjectType([])).toBe(true)
    expect(isObjectType(['foo', 'bar'])).toBe(true)
  })

  it('should be false when the value is not an object.', function () {
    expect(isObjectType('whatever')).toBe(false)
    expect(isObjectType(1)).toBe(false)
    expect(isObjectType(function () {})).toBe(false)
    expect(isObjectType(undefined)).toBe(false)
    expect(isObjectType(null)).toBe(false)
  })
})
