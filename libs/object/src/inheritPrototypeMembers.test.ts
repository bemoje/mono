import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { inheritPrototypeMembers } from './inheritPrototypeMembers'
import { it } from 'vitest'

describe(inheritPrototypeMembers.name, () => {
  it('examples', () => {
    expect(() => {
      // Create source and target classes
      class Source {
        sourceMethod() {
          return 'source'
        }

        get sourceProp() {
          return 'source getter'
        }

        set sourceProp(value: string) {
          // setter logic
        }
      }

      class Target {
        targetMethod() {
          return 'target'
        }
      }

      // Inherit prototype members from Source to Target
      inheritPrototypeMembers(Target, Source)

      // Create instance to test inherited members
      const instance = new Target() as any

      // Test that source methods are inherited
      assert.strictEqual(instance.sourceMethod(), 'source')
      assert.strictEqual(instance.sourceProp, 'source getter')
      assert.strictEqual(typeof instance.targetMethod, 'function')
      assert.strictEqual(instance.targetMethod(), 'target')

      // Test that constructor is not inherited
      assert.strictEqual(instance.constructor, Target)
    }).not.toThrow()
  })

  describe('basic inheritance', () => {
    it('should copy prototype methods from source to target', () => {
      class Source {
        sourceMethod() {
          return 'from source'
        }
      }

      class Target {}

      inheritPrototypeMembers(Target, Source)

      const instance = new Target() as any
      expect(instance.sourceMethod()).toBe('from source')
    })

    it('should copy getter properties from source to target', () => {
      class Source {
        get testProp() {
          return 'getter value'
        }
      }

      class Target {}

      inheritPrototypeMembers(Target, Source)

      const instance = new Target() as any
      expect(instance.testProp).toBe('getter value')
    })

    it('should copy setter properties from source to target', () => {
      class Source {
        private _value = ''

        set testProp(value: string) {
          this._value = value
        }

        get testProp() {
          return this._value
        }
      }

      class Target {}

      inheritPrototypeMembers(Target, Source)

      const instance = new Target() as any
      instance.testProp = 'test value'
      expect(instance.testProp).toBe('test value')
    })

    it('should return the target constructor', () => {
      class Source {
        sourceMethod() {}
      }

      class Target {}

      const result = inheritPrototypeMembers(Target, Source)
      expect(result).toBe(Target)
    })
  })

  describe('ignoring keys', () => {
    it('should always ignore constructor property', () => {
      class Source {
        sourceMethod() {
          return 'source'
        }
      }

      class Target {}

      inheritPrototypeMembers(Target, Source)

      const instance = new Target()
      expect(instance.constructor).toBe(Target)
      expect(instance.constructor).not.toBe(Source)
    })

    it('should ignore specified keys in ignoreKeys parameter', () => {
      class Source {
        methodToIgnore() {
          return 'ignored'
        }

        methodToInherit() {
          return 'inherited'
        }
      }

      class Target {}

      inheritPrototypeMembers(Target, Source, ['methodToIgnore'])

      const instance = new Target() as any
      expect(instance.methodToInherit()).toBe('inherited')
      expect(instance.methodToIgnore).toBeUndefined()
    })

    it('should ignore symbol keys when specified', () => {
      const symbolKey = Symbol('test')

      class Source {
        normalMethod() {
          return 'normal'
        }
      }

      // Add symbol method to prototype
      ;(Source.prototype as any)[symbolKey] = function () {
        return 'symbol method'
      }

      class Target {}

      inheritPrototypeMembers(Target, Source, [symbolKey])

      const instance = new Target() as any
      expect(instance.normalMethod()).toBe('normal')
      expect(instance[symbolKey]).toBeUndefined()
    })
  })

  describe('existing properties', () => {
    it('should not override existing properties on target', () => {
      class Source {
        sharedMethod() {
          return 'from source'
        }
      }

      class Target {
        sharedMethod() {
          return 'from target'
        }
      }

      inheritPrototypeMembers(Target, Source)

      const instance = new Target()
      expect(instance.sharedMethod()).toBe('from target')
    })

    it('should inherit non-conflicting properties when some exist', () => {
      class Source {
        sharedMethod() {
          return 'from source'
        }

        uniqueMethod() {
          return 'unique from source'
        }
      }

      class Target {
        sharedMethod() {
          return 'from target'
        }
      }

      inheritPrototypeMembers(Target, Source)

      const instance = new Target() as any
      expect(instance.sharedMethod()).toBe('from target')
      expect(instance.uniqueMethod()).toBe('unique from source')
    })
  })

  describe('property descriptors', () => {
    it('should preserve property descriptor attributes', () => {
      class Source {}

      Object.defineProperty(Source.prototype, 'nonEnumerableProp', {
        value: 'test',
        enumerable: false,
        writable: true,
        configurable: true,
      })

      class Target {}

      inheritPrototypeMembers(Target, Source)

      const descriptor = Object.getOwnPropertyDescriptor(Target.prototype, 'nonEnumerableProp')
      expect(descriptor?.enumerable).toBe(false)
      expect(descriptor?.writable).toBe(true)
      expect(descriptor?.configurable).toBe(true)
      expect(descriptor?.value).toBe('test')
    })

    it('should preserve accessor descriptor attributes', () => {
      class Source {}

      Object.defineProperty(Source.prototype, 'accessorProp', {
        get() {
          return 'accessor'
        },
        enumerable: false,
        configurable: true,
      })

      class Target {}

      inheritPrototypeMembers(Target, Source)

      const descriptor = Object.getOwnPropertyDescriptor(Target.prototype, 'accessorProp')
      expect(descriptor?.enumerable).toBe(false)
      expect(descriptor?.configurable).toBe(true)
      expect(typeof descriptor?.get).toBe('function')
      expect(descriptor?.set).toBeUndefined()
    })
  })

  describe('edge cases', () => {
    it('should handle empty source prototype', () => {
      class Source {}

      class Target {
        targetMethod() {
          return 'target'
        }
      }

      expect(() => {
        return inheritPrototypeMembers(Target, Source)
      }).not.toThrow()

      const instance = new Target()
      expect(instance.targetMethod()).toBe('target')
    })

    it('should handle empty target prototype', () => {
      class Source {
        sourceMethod() {
          return 'source'
        }
      }

      class Target {}

      inheritPrototypeMembers(Target, Source)

      const instance = new Target() as any
      expect(instance.sourceMethod()).toBe('source')
    })

    it('should handle empty ignoreKeys array', () => {
      class Source {
        sourceMethod() {
          return 'source'
        }
      }

      class Target {}

      expect(() => {
        return inheritPrototypeMembers(Target, Source, [])
      }).not.toThrow()

      const instance = new Target() as any
      expect(instance.sourceMethod()).toBe('source')
    })

    it('should handle undefined ignoreKeys parameter', () => {
      class Source {
        sourceMethod() {
          return 'source'
        }
      }

      class Target {}

      expect(() => {
        return inheritPrototypeMembers(Target, Source)
      }).not.toThrow()

      const instance = new Target() as any
      expect(instance.sourceMethod()).toBe('source')
    })
  })
})
