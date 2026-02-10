import { describe, expect, it } from 'vitest'
import { Parenting } from './Parenting'

describe(Parenting.name, () => {
  describe(Parenting.compose.name, () => {
    it('should add a lazy parenting property to the class (static)', () => {
      class MyClass {}
      Parenting.compose(MyClass as any)
      expect((MyClass as any).parenting).toBeDefined()
    })

    it('should add a lazy parenting property to the prototype', () => {
      class MyClass {}
      Parenting.compose(MyClass as any)
      const instance = new MyClass()
      expect((instance as any).parenting).toBeDefined()
      expect((instance as any).parenting).toBeInstanceOf(Parenting)
    })

    it('should not overwrite existing parenting properties', () => {
      const existing = { value: 'original' }
      class MyClass {
        static parenting = existing
      }
      Object.defineProperty(MyClass.prototype, 'parenting', { value: existing })
      Parenting.compose(MyClass as any)
      expect(MyClass.parenting).toBe(existing)
      expect((MyClass.prototype as any).parenting).toBe(existing)
    })
  })

  describe(Parenting.prototype.onInstance.name, () => {
    it('should store the parent reference so getParent retrieves it', () => {
      class Parent {}
      class Child {}
      Parenting.compose(Parent as any)
      Parenting.compose(Child as any)

      const parent = new Parent()
      const child = new Child()
      ;(child as any).parenting.onInstance(parent)

      expect((child as any).parenting.getParent()).toBe(parent)
    })

    it('should do nothing when parent is null', () => {
      class Root {}
      Parenting.compose(Root as any)
      const root = new Root()

      expect(() => {
        ;(root as any).parenting.onInstance(null)
      }).not.toThrow()
    })
  })

  describe('depth' satisfies keyof Parenting, () => {
    it('should return 0 for a root object with no parent', () => {
      class Root {}
      Parenting.compose(Root as any)
      const root = new Root()
      ;(root as any).parenting.onInstance(null)
      expect((root as any).parenting.depth).toBe(0)
    })

    it('should return the correct depth in a parent chain', () => {
      class A {}
      class B {}
      class C {}
      Parenting.compose(A as any)
      Parenting.compose(B as any)
      Parenting.compose(C as any)

      const a = new A()
      const b = new B()
      const c = new C()
      ;(a as any).parenting.onInstance(null)
      ;(b as any).parenting.onInstance(a)
      ;(c as any).parenting.onInstance(b)

      expect((b as any).parenting.depth).toBe(1)
      expect((c as any).parenting.depth).toBe(2)
    })
  })

  describe('iterateAncestors' satisfies keyof Parenting, () => {
    it('should stop iterating when a circular reference is detected', () => {
      class A {}
      class B {}
      Parenting.compose(A as any)
      Parenting.compose(B as any)

      const a = new A()
      const b = new B()
      ;(a as any).parenting.onInstance(b)
      ;(b as any).parenting.onInstance(a)

      const ancestors = [...(a as any).parenting.iterateAncestors()]
      expect(ancestors).toHaveLength(2)
      expect(ancestors[0]).toBe(b)
      expect(ancestors[1]).toBe(a)
    })
  })
})
