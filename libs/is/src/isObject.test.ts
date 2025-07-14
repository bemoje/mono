import { isObject } from './isObject'
import { describe, expect, it } from 'vitest'

describe(isObject.name, () => {
  it('should return true for an object', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ key: 'value' })).toBe(true)
  })

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isObject(undefined)).toBe(false)
  })

  it('should return false for a number', () => {
    expect(isObject(123)).toBe(false)
  })

  it('should return false for a string', () => {
    expect(isObject('test')).toBe(false)
  })

  it('should return false for a boolean', () => {
    expect(isObject(true)).toBe(false)
    expect(isObject(false)).toBe(false)
  })

  it('should return false for an array', () => {
    expect(isObject([])).toBe(false)
    expect(isObject([1, 2, 3])).toBe(false)
  })

  it('should return false for a function', () => {
    expect(isObject(() => 1)).toBe(false)
  })

  it('should be true when the value is an object.', function () {
    expect(isObject({})).toBe(true)
    expect(isObject(Object.create({}))).toBe(true)
    expect(isObject(Object.create(Object.prototype))).toBe(true)
    expect(isObject(Object.create(null))).toBe(true)
    expect(isObject(/foo/)).toBe(true)
    expect(isObject(new (class Foo {})())).toBe(true)
  })

  it('should be false when the value is not an object.', function () {
    expect(isObject('whatever')).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject(function () {})).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isObject(['foo', 'bar'])).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(null)).toBe(false)
  })
})
