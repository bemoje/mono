import assert from 'node:assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { getPrototypeChain } from './getPrototypeChain'
import { it } from 'vitest'

describe(getPrototypeChain.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = {}
      const chain = getPrototypeChain(obj)

      // Should include Object.prototype and null
      assert.strictEqual(chain.length, 1)
      assert.strictEqual(chain[0], Object.prototype)
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should return prototype chain for plain objects', () => {
      const obj = {}
      const chain = getPrototypeChain(obj)

      expect(chain).toHaveLength(1)
      expect(chain[0]).toBe(Object.prototype)
    })

    it('should return prototype chain for arrays', () => {
      const arr: unknown[] = []
      const chain = getPrototypeChain(arr)

      expect(chain).toHaveLength(2)
      expect(chain[0]).toBe(Array.prototype)
      expect(chain[1]).toBe(Object.prototype)
    })

    it('should return prototype chain for functions', () => {
      function testFn() {}
      const chain = getPrototypeChain(testFn)

      expect(chain).toHaveLength(2)
      expect(chain[0]).toBe(Function.prototype)
      expect(chain[1]).toBe(Object.prototype)
    })

    it('should work with class inheritance', () => {
      class Parent {}
      class Child extends Parent {}

      const child = new Child()
      const chain = getPrototypeChain(child)

      expect(chain).toHaveLength(3)
      expect(chain[0]).toBe(Child.prototype)
      expect(chain[1]).toBe(Parent.prototype)
      expect(chain[2]).toBe(Object.prototype)
    })
  })

  describe('includeSelf option', () => {
    it('should include the target object when includeSelf is true', () => {
      const obj = { test: 'value' }
      const chain = getPrototypeChain(obj, { includeSelf: true })

      expect(chain[0]).toBe(obj)
      expect(chain[1]).toBe(Object.prototype)
    })

    it('should not include the target object when includeSelf is false', () => {
      const obj = { test: 'value' }
      const chain = getPrototypeChain(obj, { includeSelf: false })

      expect(chain[0]).toBe(Object.prototype)
      expect(chain).not.toContain(obj)
    })

    it('should not include the target object by default', () => {
      const obj = { test: 'value' }
      const chain = getPrototypeChain(obj)

      expect(chain[0]).toBe(Object.prototype)
      expect(chain).not.toContain(obj)
    })
  })

  describe('complex inheritance chains', () => {
    it('should handle deep inheritance chains', () => {
      class GrandParent {}
      class Parent extends GrandParent {}
      class Child extends Parent {}
      class GrandChild extends Child {}

      const grandChild = new GrandChild()
      const chain = getPrototypeChain(grandChild)

      expect(chain).toHaveLength(5)
      expect(chain[0]).toBe(GrandChild.prototype)
      expect(chain[1]).toBe(Child.prototype)
      expect(chain[2]).toBe(Parent.prototype)
      expect(chain[3]).toBe(GrandParent.prototype)
      expect(chain[4]).toBe(Object.prototype)
    })

    it('should handle mixed built-in and custom prototypes', () => {
      class CustomArray extends Array {
        customMethod() {
          return 'custom'
        }
      }

      const customArr = new CustomArray()
      const chain = getPrototypeChain(customArr)

      expect(chain).toHaveLength(3)
      expect(chain[0]).toBe(CustomArray.prototype)
      expect(chain[1]).toBe(Array.prototype)
      expect(chain[2]).toBe(Object.prototype)
    })
  })

  describe('edge cases', () => {
    it('should handle null prototype objects', () => {
      const obj = Object.create(null)
      const chain = getPrototypeChain(obj)

      expect(chain).toHaveLength(0)
    })

    it('should handle objects with custom prototypes', () => {
      const proto = { customProp: 'value' }
      const obj = Object.create(proto)
      const chain = getPrototypeChain(obj)

      expect(chain).toHaveLength(2)
      expect(chain[0]).toBe(proto)
      expect(chain[1]).toBe(Object.prototype)
    })

    it('should work with primitive wrapper objects', () => {
      const str = new String('test')
      const chain = getPrototypeChain(str)

      expect(chain).toHaveLength(2)
      expect(chain[0]).toBe(String.prototype)
      expect(chain[1]).toBe(Object.prototype)
    })

    it('should maintain correct order in the chain', () => {
      class A {}
      class B extends A {}
      class C extends B {}

      const c = new C()
      const chain = getPrototypeChain(c)

      // Verify the order is from most specific to most general
      expect(chain[0]).toBe(C.prototype)
      expect(chain[1]).toBe(B.prototype)
      expect(chain[2]).toBe(A.prototype)
      expect(chain[3]).toBe(Object.prototype)
    })

    it('should handle prototype modifications', () => {
      class Test {}
      const customProto = { custom: true }
      Object.setPrototypeOf(Test.prototype, customProto)

      const instance = new Test()
      const chain = getPrototypeChain(instance)

      expect(chain[0]).toBe(Test.prototype)
      expect(chain[1]).toBe(customProto)
      expect(chain[2]).toBe(Object.prototype)
    })
  })
})
