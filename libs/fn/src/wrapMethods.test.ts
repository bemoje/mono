import { Any } from '@mono/types'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
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

  it('should skip methods when onMethod is not provided', () => {
    const target = {
      method1() {
        return 'original'
      },
    }
    wrapMethods(target, {})
    expect(target.method1()).toBe('original')
  })

  it('should skip getters when onGetter is not provided', () => {
    const target = {
      get prop() {
        return 'original'
      },
    }
    wrapMethods(target, {})
    expect(target.prop).toBe('original')
  })

  it('should skip setters when onSetter is not provided', () => {
    const target = {
      _val: '',
      set val(v: string) {
        this._val = v
      },
    }
    wrapMethods(target, {})
    target.val = 'test'
    expect(target._val).toBe('test')
  })

  it('should skip method when wrapper returns undefined', () => {
    const target = {
      method1() {
        return 'original'
      },
    }
    wrapMethods(target, {
      onMethod: () => {
        return undefined as Any
      },
    })
    expect(target.method1()).toBe('original')
  })

  it('should skip getter when wrapper returns undefined', () => {
    const target = {
      get prop() {
        return 'original'
      },
    }
    wrapMethods(target, {
      onGetter: () => {
        return undefined as Any
      },
    })
    expect(target.prop).toBe('original')
  })

  it('should skip setter when wrapper returns undefined', () => {
    const target = {
      _val: '',
      set val(v: string) {
        this._val = v
      },
    }
    wrapMethods(target, {
      onSetter: () => {
        return undefined as Any
      },
    })
    target.val = 'test'
    expect(target._val).toBe('test')
  })

  it('should skip non-configurable properties', () => {
    const target: Any = {}
    Object.defineProperty(target, 'method', {
      value() {
        return 'original'
      },
      configurable: false,
    })
    wrapMethods(target, {
      onMethod: (_t: Any, _k: Any, method: Any) => {
        return function () {
          return 'wrapped'
        }
      },
    })
    expect(target.method()).toBe('original')
  })
})
