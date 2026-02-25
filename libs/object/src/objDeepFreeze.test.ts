import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
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
    expect(Object.isFrozen(frozenObj.b)).toBe(true)
    expect(Object.isFrozen(frozenObj.b.d)).toBe(true)
  })

  it('should deep freeze an object with function', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: () => {
            return 1
          },
        },
      },
    }
    const frozenObj = objDeepFreeze(obj)
    expect(Object.isFrozen(frozenObj)).toBe(true)
    expect(Object.isFrozen(frozenObj.b)).toBe(true)
    expect(Object.isFrozen(frozenObj.b.d)).toBe(true)
    expect(Object.isFrozen(frozenObj.b.d.f)).toBe(true)
  })

  it('should throw an error if the argument is not an object or function', () => {
    expect(() => {
      return objDeepFreeze(123 as any)
    }).toThrow()
    expect(() => {
      return objDeepFreeze('string' as any)
    }).toThrow()
    expect(() => {
      return objDeepFreeze(true as any)
    }).toThrow()
  })

  it('should not throw an error if the argument is a function', () => {
    const func = () => {
      return 1
    }
    expect(() => {
      return objDeepFreeze(func as any)
    }).not.toThrow()
    expect(Object.isFrozen(func)).toBe(true)
  })
})
