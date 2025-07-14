import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { inheritProxifiedPrototypeProperty } from './inheritProxifiedPrototypeProperty'
import { IView } from './IView'

// Mock target classes for testing
class TargetClass {
  method() {
    return 'method result'
  }

  methodWithArgs(a: number, b: string) {
    return `${a}-${b}`
  }

  get getter() {
    return 'getter value'
  }

  set setter(value: string) {
    this._setterValue = value
  }

  get setter() {
    return this._setterValue || 'default'
  }

  private _setterValue?: string

  get getterOnly() {
    return 'getter only'
  }
}

// Define prototype properties for testing
Object.defineProperty(TargetClass.prototype, 'value', {
  value: 42,
  writable: true,
  configurable: true,
  enumerable: true,
})

Object.defineProperty(TargetClass.prototype, 'readonlyProp', {
  value: 'readonly',
  writable: false,
  configurable: true,
  enumerable: true,
})

// Mock viewer class
class ViewerClass implements IView<TargetClass> {
  constructor(public target: TargetClass) {}
}

describe(inheritProxifiedPrototypeProperty.name, () => {
  it('examples', () => {
    expect(() => {
      // Create fresh classes for each test to avoid pollution
      class TestTarget {
        declare value: number
        method() {
          return 'method result'
        }
        get getter() {
          return 'getter value'
        }
      }

      // Define value as prototype property (without class field)
      Object.defineProperty(TestTarget.prototype, 'value', {
        value: 42,
        writable: true,
        configurable: true,
        enumerable: true,
      })

      class TestViewer implements IView<TestTarget> {
        constructor(public target: TestTarget) {}
      }

      const target = new TestTarget()

      // Test method inheritance
      inheritProxifiedPrototypeProperty(TestViewer, TestTarget, 'method')
      const viewer1 = new TestViewer(target)
      const result = (viewer1 as any).method()
      assert.strictEqual(result, 'method result')

      // Test property inheritance
      inheritProxifiedPrototypeProperty(TestViewer, TestTarget, 'value')
      const viewer2 = new TestViewer(target)
      assert.strictEqual((viewer2 as any).value, 42)
      ;(viewer2 as any).value = 100
      assert.strictEqual((target as any).value, 100)

      // Test getter inheritance
      inheritProxifiedPrototypeProperty(TestViewer, TestTarget, 'getter')
      const viewer3 = new TestViewer(target)
      assert.strictEqual((viewer3 as any).getter, 'getter value')
    }).not.toThrow()
  })

  describe('method inheritance', () => {
    it('should inherit methods and proxy calls to target', () => {
      class TestTarget {
        method() {
          return 'method result'
        }
      }

      class TestViewer implements IView<TestTarget> {
        constructor(public target: TestTarget) {}
      }

      const target = new TestTarget()

      inheritProxifiedPrototypeProperty(TestViewer, TestTarget, 'method')
      const viewer = new TestViewer(target)

      expect((viewer as any).method()).toBe('method result')
    })

    it('should pass arguments to target method', () => {
      class TestTarget {
        methodWithArgs(a: number, b: string) {
          return `${a}-${b}`
        }
      }

      class TestViewer implements IView<TestTarget> {
        constructor(public target: TestTarget) {}
      }

      const target = new TestTarget()

      inheritProxifiedPrototypeProperty(TestViewer, TestTarget, 'methodWithArgs')
      const viewer = new TestViewer(target)

      expect((viewer as any).methodWithArgs(123, 'test')).toBe('123-test')
    })
  })

  describe('property inheritance', () => {
    it('should inherit writable properties with getter and setter', () => {
      class TestTarget {
        // Placeholder for type inference
        declare value: number
      }

      // Define as prototype property (no class field)
      Object.defineProperty(TestTarget.prototype, 'value', {
        value: 42,
        writable: true,
        configurable: true,
        enumerable: true,
      })

      class TestViewer implements IView<TestTarget> {
        constructor(public target: TestTarget) {}
      }

      const target = new TestTarget()

      inheritProxifiedPrototypeProperty(TestViewer, TestTarget, 'value')
      const viewer = new TestViewer(target)

      expect((viewer as any).value).toBe(42)
      ;(viewer as any).value = 99
      expect((target as any).value).toBe(99)
    })

    it('should inherit readonly properties with only getter', () => {
      class TestTarget {
        // Placeholder for type inference
        declare readonlyProp: string
      }

      // Make it readonly
      Object.defineProperty(TestTarget.prototype, 'readonlyProp', {
        value: 'readonly',
        writable: false,
        configurable: true,
        enumerable: true,
      })

      class TestViewer implements IView<TestTarget> {
        constructor(public target: TestTarget) {}
      }

      const target = new TestTarget()

      inheritProxifiedPrototypeProperty(TestViewer, TestTarget, 'readonlyProp')
      const viewer = new TestViewer(target)

      expect((viewer as any).readonlyProp).toBe('readonly')

      const descriptor = Object.getOwnPropertyDescriptor(TestViewer.prototype, 'readonlyProp')
      expect(descriptor?.set).toBeUndefined()
    })
  })

  describe('accessor inheritance', () => {
    it('should inherit getter/setter properties', () => {
      const target = new TargetClass()
      const viewer = new ViewerClass(target)

      inheritProxifiedPrototypeProperty(ViewerClass, TargetClass, 'setter')

      expect((viewer as any).setter).toBe('default')
      ;(viewer as any).setter = 'new value'
      expect(target.setter).toBe('new value')
    })

    it('should inherit getter-only properties', () => {
      const target = new TargetClass()
      const viewer = new ViewerClass(target)

      inheritProxifiedPrototypeProperty(ViewerClass, TargetClass, 'getterOnly')

      expect((viewer as any).getterOnly).toBe('getter only')

      const descriptor = Object.getOwnPropertyDescriptor(ViewerClass.prototype, 'getterOnly')
      expect(descriptor?.get).toBeDefined()
      expect(descriptor?.set).toBeUndefined()
    })
  })

  describe('edge cases', () => {
    it('should return early if property does not exist', () => {
      const result = inheritProxifiedPrototypeProperty(ViewerClass, TargetClass, 'nonexistent' as any)

      expect(result).toBeUndefined()
    })

    it('should set correct property descriptors', () => {
      inheritProxifiedPrototypeProperty(ViewerClass, TargetClass, 'method')

      const descriptor = Object.getOwnPropertyDescriptor(ViewerClass.prototype, 'method')

      expect(descriptor?.writable).toBe(true)
      expect(descriptor?.configurable).toBe(true)
      expect(descriptor?.enumerable).toBe(false)
    })

    it('should handle properties with undefined getters/setters', () => {
      class CustomTarget {
        get customGetter() {
          return 'custom'
        }
      }

      class CustomViewer implements IView<CustomTarget> {
        constructor(public target: CustomTarget) {}
      }

      expect(() => {
        inheritProxifiedPrototypeProperty(CustomViewer, CustomTarget, 'customGetter')
      }).not.toThrow()
    })
  })
})
