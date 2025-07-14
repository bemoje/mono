import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { iteratePrototypes } from './iteratePrototypes'

describe(iteratePrototypes.name, () => {
  it('examples', () => {
    expect(() => {
      class A {}
      class B extends A {}
      const instance = new B()

      const prototypes = Array.from(iteratePrototypes(instance))

      // Should yield prototype chain
      assert(prototypes.length >= 2)
      assert(prototypes.includes(B.prototype))
      assert(prototypes.includes(A.prototype))
    }).not.toThrow()
  })

  it('should iterate through prototype chain', () => {
    class A {}
    class B extends A {}
    class C extends B {}
    const instance = new C()

    const prototypes = Array.from(iteratePrototypes(instance))

    expect(prototypes).toContain(C.prototype)
    expect(prototypes).toContain(B.prototype)
    expect(prototypes).toContain(A.prototype)
    expect(prototypes).toContain(Object.prototype)
  })

  it('should handle options.includeSelf', () => {
    class A {}
    const instance = new A()

    const withoutSelf = Array.from(iteratePrototypes(instance))
    const withSelf = Array.from(iteratePrototypes(instance, { includeSelf: true }))

    expect(withSelf.length).toBeGreaterThan(withoutSelf.length)
  })

  it('should handle plain objects', () => {
    const obj = {}
    const prototypes = Array.from(iteratePrototypes(obj))

    expect(prototypes).toContain(Object.prototype)
  })
})
