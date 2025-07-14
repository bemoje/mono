import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { iterateClasses } from './iterateClasses'

describe(iterateClasses.name, () => {
  it('examples', () => {
    expect(() => {
      class A {}
      class B extends A {}
      const instance = new B()

      const classes = Array.from(iterateClasses(instance))

      // Should yield superclass chain (excludes B by default)
      assert(classes.length >= 1)
      assert(classes.includes(A))
      assert(classes.includes(Object))
    }).not.toThrow()
  })

  it('should iterate through superclass chain from instance', () => {
    class A {}
    class B extends A {}
    class C extends B {}
    const instance = new C()

    const classes = Array.from(iterateClasses(instance))

    expect(classes).not.toContain(C) // Excludes self by default
    expect(classes).toContain(B)
    expect(classes).toContain(A)
    expect(classes).toContain(Object)
  })

  it('should iterate through superclass chain from constructor', () => {
    class A {}
    class B extends A {}
    class C extends B {}

    const classes = Array.from(iterateClasses(C))

    expect(classes).not.toContain(C) // Excludes self by default
    expect(classes).toContain(B)
    expect(classes).toContain(A)
    expect(classes).toContain(Object)
  })

  it('should handle options.includeSelf', () => {
    class A {}
    class B extends A {}
    const instance = new B()

    const withoutSelf = Array.from(iterateClasses(instance))
    const withSelf = Array.from(iterateClasses(instance, { includeSelf: true }))

    expect(withSelf.length).toBeGreaterThan(withoutSelf.length)
    expect(withSelf).toContain(B)
    expect(withoutSelf).not.toContain(B)
  })

  it('should handle plain objects', () => {
    const obj = {}
    const classes = Array.from(iterateClasses(obj))

    expect(classes).toContain(Object)
  })
})
