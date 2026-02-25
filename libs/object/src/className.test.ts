import { className } from './className'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(className.name, () => {
  it('should return the class name of a class instance', () => {
    class TestClass {}
    const instance = new TestClass()
    expect(className(instance)).toBe('TestClass')
  })

  it('should return the class name of an extended class instance', () => {
    class BaseClass {}
    class ExtendedClass extends BaseClass {}
    const instance = new ExtendedClass()
    expect(className(instance)).toBe('ExtendedClass')
  })

  it('should return "Object" for plain objects', () => {
    const obj = {}
    expect(className(obj)).toBe('Object')
  })

  it('should work with built-in objects', () => {
    expect(className(new Date())).toBe('Date')
    expect(className(new Map())).toBe('Map')
    expect(className(new Set())).toBe('Set')
    expect(className(new RegExp(''))).toBe('RegExp')
  })

  it('should work with arrays', () => {
    expect(className([])).toBe('Array')
  })
})
