import { describe, it, expect } from 'vitest'
import { staticClassKeysOf } from './staticClassKeysOf'

describe(staticClassKeysOf.name, () => {
  class TestClass {
    static staticProp1 = 'value1'
    static staticProp2 = 'value2'
    static staticMethod() {
      return 'method'
    }
  }

  it('should return only static properties and methods of the class', () => {
    expect(staticClassKeysOf(TestClass).sort()).toEqual(['staticProp1', 'staticProp2', 'staticMethod'].sort())
  })

  it('should not include built-in keys like length, name, and prototype', () => {
    const keys = staticClassKeysOf(TestClass)
    expect(keys).not.toContain('length')
    expect(keys).not.toContain('name')
    expect(keys).not.toContain('prototype')
  })

  it('should return an empty array for a class with no static properties or methods', () => {
    class EmptyClass {}
    const keys = staticClassKeysOf(EmptyClass)
    expect(keys).toEqual([])
  })
})
