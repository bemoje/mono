import { describe, expect, it } from 'vitest'
import { Any } from '@mono/types'
import { wrapMethods } from './wrapMethods'

describe(wrapMethods.name, () => {
  it('should wrap methods with custom logic', () => {
    const target = {
      method1() {
        return 'original method1'
      },
      method2() {
        return 'original method2'
      },
    }

    const strategy = {
      onMethod(target: Any, key: string | symbol, method: Any) {
        return function (...args: unknown[]) {
          return `wrapped ${method.apply(target, args)}`
        }
      },
    }

    wrapMethods(target, strategy as never)

    expect(target.method1()).toBe('wrapped original method1')
    expect(target.method2()).toBe('wrapped original method2')
  })

  it('should wrap getters with custom logic', () => {
    const target = {
      get prop1() {
        return 'original prop1'
      },
      get prop2() {
        return 'original prop2'
      },
    }

    const strategy = {
      onGetter(target: Any, key: string | symbol, getter: Any) {
        return function () {
          return `wrapped ${getter.call(target)}`
        }
      },
    }

    wrapMethods(target, strategy as never)

    expect(target.prop1).toBe('wrapped original prop1')
    expect(target.prop2).toBe('wrapped original prop2')
  })

  it('should wrap setters with custom logic', () => {
    const target = {
      _prop1: '',
      _prop2: '',

      set prop1(value: string) {
        this._prop1 = value
      },
      set prop2(value: string) {
        this._prop2 = value
      },
    }

    const strategy = {
      onSetter(target: Any, key: string | symbol, setter: Any) {
        return function (value: string) {
          setter.call(target, `wrapped ${value}`)
        }
      },
    }

    wrapMethods(target, strategy as never)

    target.prop1 = 'new prop1'
    target.prop2 = 'new prop2'

    expect(target._prop1).toBe('wrapped new prop1')
    expect(target._prop2).toBe('wrapped new prop2')
  })

  it('should skip methods that do not match the filter', () => {
    const target = {
      method1() {
        return 'original method1'
      },
      method2() {
        return 'original method2'
      },
    }

    const strategy = {
      filter(target: Any, key: string | symbol, _type: string) {
        return key === 'method1'
      },
      onMethod(target: Any, key: string | symbol, method: Any) {
        return function (...args: unknown[]) {
          return `wrapped ${method.apply(target, args)}`
        }
      },
    }

    wrapMethods(target, strategy as never)

    expect(target.method1()).toBe('wrapped original method1')
    expect(target.method2()).toBe('original method2')
  })
})
