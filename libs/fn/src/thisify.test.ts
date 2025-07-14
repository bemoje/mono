import { describe, expect, it } from 'vitest'
import { thisify } from './thisify'

describe(thisify.name, () => {
  class MyClass {
    value: number

    constructor(value: number) {
      this.value = value
    }

    getValue(): number {
      return this.value
    }
  }

  it('should convert a function to a class method', () => {
    const fn = function (target: MyClass, value: number): number {
      return target.getValue() + value
    }
    const myInstance = new MyClass(10)
    const thisifiedFn = thisify(fn)
    const result = thisifiedFn.call(myInstance, 5)
    expect(result).toBe(15)
  })

  it('should set the original function name and adjust length', () => {
    const fn = function (target: MyClass, value: number): number {
      return target.getValue() + value
    }
    const thisifiedFn = thisify(fn)
    expect(thisifiedFn.name).toBe(fn.name)
    expect(thisifiedFn.length).toBe(fn.length - 1)
  })
})
