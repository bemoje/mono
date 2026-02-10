import { describe, expect, it } from 'vitest'
import { inspect } from 'node:util'
import { Inspector, InspectorTarget } from './Inspector'

describe(Inspector.name, () => {
  it('examples', () => {
    class A {
      static inspector = Inspector.compose(A, {
        keys: ['one', 'two', 'a'],
        ignoreValues: { noFalse: true },
        autoAddBooleanKeys: true,
      })

      get a() {
        return 'a'
      }
      get one() {
        return 1
      }
    }

    class B extends A {
      static inspector = Inspector.compose(B, {
        keys: ['three', 'b'],
        ignoreKeys: ['a'],
      })

      get two() {
        return 2
      }
      get three() {
        return 3
      }
      get b() {
        return 'b'
      }
      get c() {
        return 'c'
      }
    }

    const instances = [new A(), new B(), new A(), new B()]
    const inspectStrings = instances.map((x) =>
      (x as unknown as InspectorTarget).inspector.inspect(0, { colors: false }),
    )
    const [a1, b1, a2, b2] = inspectStrings

    expect(a1).toBe(`[A] { one: 1, a: 'a' }`)
    expect(b1).toBe(`[B] { one: 1, two: 2, three: 3, b: 'b' }`)
    expect(a2).toBe(`[A] { one: 1, a: 'a' }`)
    expect(b2).toBe(`[B] { one: 1, two: 2, three: 3, b: 'b' }`)

    instances
      .map((x) => (x as unknown as InspectorTarget).inspector.toObject())
      .forEach((obj) => {
        expect(obj).toBeTypeOf('object')
      })
  })

  describe('compose', () => {
    it('should skip defining methods that already exist on the prototype', () => {
      class Existing {
        [inspect.custom]() {
          return 'custom'
        }
        get inspector(): any {
          return 'existing'
        }
        toJSON() {
          return { existing: true }
        }
      }
      const result = Inspector.compose(Existing as any, {})
      expect(result).toEqual({})
      // original methods are preserved
      const instance = new Existing()
      expect(instance[inspect.custom]()).toBe('custom')
      expect(instance.inspector).toBe('existing')
      expect(instance.toJSON()).toEqual({ existing: true })
    })

    it('should return options object', () => {
      class Empty {}
      const options = { keys: ['x'] }
      const result = Inspector.compose(Empty as any, options)
      expect(result).toBe(options)
    })
  })

  describe('inspect', () => {
    it('should render with colors when colors option is true', () => {
      class Colored {
        static inspector = Inspector.compose(Colored, { keys: ['val'] })
        val = 42
      }
      const ins = (new Colored() as unknown as InspectorTarget).inspector
      const result = ins.inspect(0, { colors: true })
      expect(result).toContain('Colored')
      expect(result).toContain('42')
    })

    it('should use default depth 0 and empty options', () => {
      class Simple {
        static inspector = Inspector.compose(Simple, { keys: ['x'] })
        x = 1
      }
      const ins = (new Simple() as unknown as InspectorTarget).inspector
      const result = ins.inspect()
      expect(result).toContain('1')
    })
  })

  describe('toObject', () => {
    it('should handle falsy values in output', () => {
      class WithFalsy {
        static inspector = Inspector.compose(WithFalsy, {
          keys: ['a', 'b', 'c'],
          ignoreValues: { noNull: false, noUndefined: false },
        })
        a = 0
        b = null
        c = ''
      }
      const obj = (new WithFalsy() as unknown as InspectorTarget).inspector.toObject()
      expect(obj).toHaveProperty('T', 'WithFalsy')
      expect(obj).toHaveProperty('a', 0)
      expect(obj).toHaveProperty('b', null)
      expect(obj).toHaveProperty('c', '')
    })

    it('should handle array values containing Inspector targets', () => {
      class Child {
        static inspector = Inspector.compose(Child, { keys: ['name'] })
        constructor(public name: string) {}
      }

      class Parent {
        static inspector = Inspector.compose(Parent, { keys: ['children'] })
        children: Child[]
        constructor() {
          this.children = [new Child('a'), new Child('b')]
        }
      }

      const obj = (new Parent() as unknown as InspectorTarget).inspector.toObject()
      expect(obj).toHaveProperty('T', 'Parent')
      expect(Array.isArray((obj as any).children)).toBe(true)
      expect((obj as any).children[0]).toHaveProperty('T', 'Child')
      expect((obj as any).children[0]).toHaveProperty('name', 'a')
    })

    it('should handle array values without Inspector targets', () => {
      class WithArray {
        static inspector = Inspector.compose(WithArray, { keys: ['items'] })
        items = [1, 2, 3]
      }
      const obj = (new WithArray() as unknown as InspectorTarget).inspector.toObject()
      expect((obj as any).items).toEqual([1, 2, 3])
    })

    it('should handle object values with Inspector targets', () => {
      class Inner {
        static inspector = Inspector.compose(Inner, { keys: ['val'] })
        val = 99
      }

      class Outer {
        static inspector = Inspector.compose(Outer, { keys: ['inner'] })
        inner: Inner
        constructor() {
          this.inner = new Inner()
        }
      }

      const obj = (new Outer() as unknown as InspectorTarget).inspector.toObject()
      expect((obj as any).inner).toHaveProperty('T', 'Inner')
      expect((obj as any).inner).toHaveProperty('val', 99)
    })

    it('should handle plain object values without Inspector', () => {
      class WithPlainObj {
        static inspector = Inspector.compose(WithPlainObj, { keys: ['data'] })
        data = { x: 1, y: 2 }
      }
      const obj = (new WithPlainObj() as unknown as InspectorTarget).inspector.toObject()
      expect((obj as any).data).toEqual({ x: 1, y: 2 })
    })
  })

  describe('compile', () => {
    it('should auto-add boolean getter keys matching is/has/was/should pattern', () => {
      class BooleanBase {
        get shouldRender() {
          return true
        }
        get wasProcessed() {
          return false
        }
        // should NOT be auto-added (doesn't match pattern)
        get active() {
          return true
        }
        // non-getter prototype method should NOT be auto-added
        doSomething() {
          return true
        }
      }

      class WithBooleans extends BooleanBase {
        static inspector = Inspector.compose(WithBooleans, {
          keys: ['name'],
          autoAddBooleanKeys: true,
        })
        name = 'test'
        isActive = true
        hasData = false
      }
      const obj = (new WithBooleans() as unknown as InspectorTarget).inspector.toObject()
      expect(obj).toHaveProperty('name', 'test')
      expect(obj).toHaveProperty('isActive', true)
      expect(obj).toHaveProperty('hasData', false)
      expect(obj).toHaveProperty('shouldRender', true)
      expect(obj).toHaveProperty('wasProcessed', false)
      expect(obj).not.toHaveProperty('active')
      expect(obj).not.toHaveProperty('doSomething')
    })

    it('should apply custom filters', () => {
      class Filtered {
        static inspector = Inspector.compose(Filtered, {
          keys: ['a', 'b', 'c'],
          filters: [(_value: unknown, key: string | symbol) => key !== 'b'],
        })
        a = 1
        b = 2
        c = 3
      }
      const obj = (new Filtered() as unknown as InspectorTarget).inspector.toObject()
      expect(obj).toHaveProperty('a', 1)
      expect(obj).not.toHaveProperty('b')
      expect(obj).toHaveProperty('c', 3)
    })

    it('should filter out values based on ignoreValues filters', () => {
      class WithIgnored {
        static inspector = Inspector.compose(WithIgnored, {
          keys: ['a', 'b', 'c', 'd'],
          ignoreValues: { noNull: true, noUndefined: true, noEmptyArray: true, noEmptyObject: true },
        })
        a = null
        b = undefined
        c: any[] = []
        d = {}
      }
      const obj = (new WithIgnored() as unknown as InspectorTarget).inspector.toObject()
      expect(obj).not.toHaveProperty('a')
      expect(obj).not.toHaveProperty('b')
      expect(obj).not.toHaveProperty('c')
      expect(obj).not.toHaveProperty('d')
    })
  })

  describe('mergePrototypeOptions', () => {
    it('should merge options from class hierarchy with subclass overriding', () => {
      class Base {
        static inspector = Inspector.compose(Base, {
          keys: ['x'],
          inspect: { depth: 1 },
          autoAddBooleanKeys: false,
        })
        x = 10
        get isReady() {
          return true
        }
      }

      class Child extends Base {
        static inspector = Inspector.compose(Child, {
          keys: ['y'],
          inspect: { depth: 5 },
          autoAddBooleanKeys: true,
          ignoreKeys: ['x'],
        })
        y = 20
      }

      const obj = (new Child() as unknown as InspectorTarget).inspector.toObject()
      expect(obj).toHaveProperty('y', 20)
      expect(obj).not.toHaveProperty('x')
      // isReady is on Base (parent) and found via autoAddBooleanKeys with protoGetterKeys
      expect(obj).toHaveProperty('isReady', true)
    })
  })

  describe('composed prototype methods', () => {
    it('should add inspect.custom that delegates to inspector', () => {
      class Auto {
        static inspector = Inspector.compose(Auto, { keys: ['val'] })
        val = 42
      }
      const instance = new Auto() as unknown as InspectorTarget
      const result = instance[inspect.custom](0, { colors: false })
      expect(result).toContain('42')
      expect(result).toContain('Auto')
    })

    it('should add toJSON that delegates to inspector.toObject', () => {
      class Auto {
        static inspector = Inspector.compose(Auto, { keys: ['val'] })
        val = 42
      }
      const instance = new Auto() as unknown as InspectorTarget
      const json = instance.toJSON()
      expect(json).toHaveProperty('T', 'Auto')
      expect(json).toHaveProperty('val', 42)
    })
  })
})
