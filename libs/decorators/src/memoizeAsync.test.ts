import { memoizeAsync } from './memoizeAsync'
import { describe, expect, it } from 'vitest'

describe(memoizeAsync.name, () => {
  it('should memoized the function on the target object', async () => {
    let wasCalled = false

    class A {
      constructor(readonly name: string) {}

      @memoizeAsync()
      async value() {
        wasCalled = true
        return this.name
      }
    }

    const a1 = new A('1')
    const a2 = new A('2')

    expect(wasCalled).toBe(false)
    expect(await a1.value()).toBe('1')
    expect(wasCalled).toBe(true)
    expect(await a2.value()).toBe('2')

    wasCalled = false
    expect(wasCalled).toBe(false)
    expect(await a1.value()).toBe('1')
    expect(wasCalled).toBe(false)
  })

  it('should ignore this when memoized with instancesShareCache=true', async () => {
    class A {
      constructor(readonly name: string) {}

      @memoizeAsync({ instancesShareCache: true })
      async value() {
        return this.name
      }
    }

    const a1 = new A('1')
    const a2 = new A('2')

    expect(await a1.value()).toBe('1')
    expect(await a2.value()).toBe('1')
  })

  it('should throw an error if "value" is not a function', () => {
    const target = {}
    const key = 'prop'
    const descriptor = {}

    expect(() => {
      memoizeAsync()(target, key, descriptor)
    }).toThrow('"value" not a function')
  })

  it('should memoize functions with parameters', async () => {
    const functionInvocations: Map<string, number> = new Map()

    class A {
      constructor(readonly name: string) {}

      @memoizeAsync({ maxAge: 1000 * 60 * 60 })
      async value(param: string) {
        const count = functionInvocations.get(param) || 0
        functionInvocations.set(param, count + 1)
        return this.name + param
      }
    }

    const a1 = new A('1')

    expect(await a1.value('a')).toBe('1a')
    expect(await a1.value('a')).toBe('1a')
    expect(await a1.value('b')).toBe('1b')

    expect(functionInvocations.get('a')).toBe(1)
    expect(functionInvocations.get('b')).toBe(1)
  })

  it('should memoize functions with object parameters', async () => {
    const functionInvocations: Map<string, number> = new Map()

    class A {
      constructor(readonly name: string) {}

      @memoizeAsync({ maxAge: 1000 * 60 * 60, normalizer: JSON.stringify })
      async value(param: { foo: string }) {
        const count = functionInvocations.get(param.foo) || 0
        functionInvocations.set(param.foo, count + 1)
        return this.name + param.foo
      }
    }

    const a1 = new A('1')

    expect(await a1.value({ foo: 'a' })).toBe('1a')
    expect(await a1.value({ foo: 'a' })).toBe('1a')
    expect(await a1.value({ foo: 'b' })).toBe('1b')

    expect(functionInvocations.get('a')).toBe(1)
    expect(functionInvocations.get('b')).toBe(1)
  })
})
