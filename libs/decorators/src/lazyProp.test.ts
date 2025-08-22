import { setTimeout as setTimeoutPromise } from 'timers/promises'
import { lazyProp } from './lazyProp'
import { describe, expect, it } from 'vitest'

describe(lazyProp.name, () => {
  it('should define a lazy property', () => {
    let c = 0

    class A {
      @lazyProp
      get value() {
        return ++c
      }
    }

    const a = new A()
    expect(a.value).toBe(1)
  })

  it('should define a method as a lazy property', () => {
    let c = 0

    class A {
      @lazyProp
      value() {
        return ++c
      }
    }

    const a = new A()
    expect(a.value()).toBe(1)
  })

  it('values are not memoized across seperate instances', () => {
    let c = 0

    class A {
      @lazyProp
      get value() {
        return ++c
      }
    }

    const a = new A()
    expect(a.value).toBe(1)

    const b = new A()
    expect(b.value).toBe(2)
  })

  it('should define a temp lazy property', async () => {
    let c = 0
    class A {
      @lazyProp(50)
      get value() {
        return ++c
      }
    }

    const a = new A()
    expect(a.value).toBe(1)

    await setTimeoutPromise(250)
    expect(a.value).toBe(2)
  })

  it('should throw an error if "get" is not a function', () => {
    const target = {}
    const key = 'prop'
    const descriptor = {}

    expect(() => {
      lazyProp(target, key, descriptor)
    }).toThrow()
  })
})
