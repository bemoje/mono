import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { thisProxy } from './thisProxy'

describe(thisProxy.name, () => {
  it('examples', () => {
    expect(() => {
      // Property key proxy example
      class Container {
        inner = {
          value: 'test',
          getValue() {
            return this.value
          },
        }
      }

      const container = new Container()
      const getValue = thisProxy(container.inner.getValue, 'inner')

      const result = getValue.call(container)
      assert.deepStrictEqual(result, 'test', 'property key proxy works')
    }).not.toThrow()
  })

  describe('property key proxy', () => {
    it('should proxy this context to specified property', () => {
      class Parent {
        child = {
          value: 42,
          getValue() {
            return this.value
          },
          multiply(factor: number) {
            return this.value * factor
          },
        }
      }

      const parent = new Parent()
      const getValue = thisProxy(parent.child.getValue, 'child')
      const multiply = thisProxy(parent.child.multiply, 'child')

      expect(getValue.call(parent)).toBe(42)
      expect(multiply.call(parent, 3)).toBe(126)
    })

    it('should work with symbol keys', () => {
      const childSymbol = Symbol('child')

      class SymbolParent {
        [childSymbol] = {
          data: 'symbol-data',
          getData() {
            return this.data
          },
        }
      }

      const parent = new SymbolParent()
      const getData = thisProxy(parent[childSymbol].getData, childSymbol)

      expect(getData.call(parent)).toBe('symbol-data')
    })

    it('should preserve function name and length', () => {
      class TestClass {
        target = {
          testMethod(a: string, b: number) {
            return `${a}-${b}`
          },
        }
      }

      const instance = new TestClass()
      const proxied = thisProxy(instance.target.testMethod, 'target')

      expect(proxied.name).toBe('testMethod')
      expect(proxied.length).toBe(2)
    })
  })

  describe('callback proxy', () => {
    it('should proxy this context using callback function with matching types', () => {
      // Test with types that match the overload requirements
      const config = {
        setting: 'enabled',
        getSetting() {
          return this.setting
        },
      }

      // The callback must return the same type as expected by the function
      const getSetting = thisProxy(config.getSetting, (obj: typeof config) => obj)

      expect(getSetting.call(config)).toBe('enabled')
    })
  })

  describe('edge cases', () => {
    it('should handle methods that return this', () => {
      interface FluentTarget {
        value: string
        append(text: string): this
        getValue(): string
      }

      class FluentAPI {
        api: FluentTarget = {
          value: '',
          append(text: string) {
            this.value += text
            return this
          },
          getValue() {
            return this.value
          },
        }
      }

      const fluent = new FluentAPI()
      const append = thisProxy(fluent.api.append, 'api')
      const getValue = thisProxy(fluent.api.getValue, 'api')

      const result = append.call(fluent, 'test')
      expect(result).toBe(fluent.api)
      expect(getValue.call(fluent)).toBe('test')
    })

    it('should handle async methods', async () => {
      interface AsyncService {
        data: string
        getData(): Promise<string>
      }

      class AsyncContainer {
        service: AsyncService = {
          data: 'async-data',
          async getData() {
            await new Promise((resolve) => setTimeout(resolve, 1))
            return this.data
          },
        }
      }

      const container = new AsyncContainer()
      const getData = thisProxy(container.service.getData, 'service')

      const result = await getData.call(container)
      expect(result).toBe('async-data')
    })

    it('should handle methods with no parameters', () => {
      class Simple {
        target = {
          getValue: () => 'simple-value',
        }
      }

      const simple = new Simple()
      const getValue = thisProxy(simple.target.getValue, 'target')

      expect(getValue.call(simple)).toBe('simple-value')
    })
  })
})
