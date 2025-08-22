import { describe, expect, it } from 'vitest'

import { objDeepFreeze } from './objDeepFreeze'

describe('objDeepFreeze', () => {
  it('should deep freeze an object', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    }
    const frozenObj = objDeepFreeze(obj)
    expect(Object.isFrozen(frozenObj)).toBe(true)
    expect(Object.isFrozen(frozenObj['b'])).toBe(true)
    expect(Object.isFrozen(frozenObj['b']['d'])).toBe(true)
  })

  it('should deep freeze an object with function', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: () => 1,
        },
      },
    }
    const frozenObj = objDeepFreeze(obj)
    expect(Object.isFrozen(frozenObj)).toBe(true)
    expect(Object.isFrozen(frozenObj['b'])).toBe(true)
    expect(Object.isFrozen(frozenObj['b']['d'])).toBe(true)
    expect(Object.isFrozen(frozenObj['b']['d']['f'])).toBe(true)
  })

  it('should throw an error if the argument is not an object or function', () => {
    expect(() => objDeepFreeze(123 as any)).toThrow()
    expect(() => objDeepFreeze('string' as any)).toThrow()
    expect(() => objDeepFreeze(true as any)).toThrow()
  })

  it('should not throw an error if the argument is a function', () => {
    const func = () => 1
    expect(() => objDeepFreeze(func as any)).not.toThrow()
    expect(Object.isFrozen(func)).toBe(true)
  })
})
