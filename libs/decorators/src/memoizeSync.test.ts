import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { memoizeSync } from './memoizeSync'

describe(memoizeSync.name, () => {
  it('should memoized the function on the target object', () => {
    let wasCalled = false

    class A {
      constructor(readonly name: string) {}

      @memoizeSync()
      value() {
        wasCalled = true
        return this.name
      }
    }

    const a1 = new A('1')
    const a2 = new A('2')

    expect(wasCalled).toBe(false)
    expect(a1.value()).toBe('1')
    expect(wasCalled).toBe(true)
    expect(a2.value()).toBe('2')

    wasCalled = false
    expect(wasCalled).toBe(false)
    expect(a1.value()).toBe('1')
    expect(wasCalled).toBe(false)
  })

  it('should ignore this when memoized with instancesShareCache=true', () => {
    class A {
      constructor(readonly name: string) {}

      @memoizeSync({ instancesShareCache: true })
      value() {
        return this.name
      }
    }

    const a1 = new A('1')
    const a2 = new A('2')

    expect(a1.value()).toBe('1')
    expect(a2.value()).toBe('1')
  })

  it('should throw an error if "value" is not a function', () => {
    const target = {}
    const key = 'prop'
    const descriptor = {}

    expect(() => {
      memoizeSync()(target, key, descriptor)
    }).toThrow('"value" not a function')
  })

  it('should throw an error if descriptor is undefined', () => {
    expect(() => {
      memoizeSync()({}, 'prop', undefined as any)
    }).toThrow('descriptor is undefined')
  })

  it('should accept a numeric maxAge', () => {
    let c = 0
    class A {
      @memoizeSync(60000)
      value() {
        return ++c
      }
    }
    const a = new A()
    expect(a.value()).toBe(1)
    expect(a.value()).toBe(1)
  })

  it('should accept a string maxAge', () => {
    let c = 0
    class A {
      @memoizeSync('1h')
      value() {
        return ++c
      }
    }
    const a = new A()
    expect(a.value()).toBe(1)
    expect(a.value()).toBe(1)
  })
})
