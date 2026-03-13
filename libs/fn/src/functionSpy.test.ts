import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { functionSpy } from './functionSpy'
import { it } from 'vitest'
import { vitest } from 'vitest'

describe(functionSpy.name, () => {
  const data = {}
  const spyStrategy = {
    onInvoke: vitest.fn((_thisContext: unknown, _args: unknown[]): object => {
      return data
    }),
    onReturn: vitest.fn(<Ret>(data: object, retval: Ret): Ret => {
      return retval
    }),
  }

  beforeEach(() => {
    vitest.clearAllMocks()
  })

  it('should wrap a sync function with the provided spy strategy', () => {
    const originalFunc = vitest.fn((n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy)
    expect(wrappedFunc(1)).toBe(2)
    expect(spyStrategy.onInvoke).toHaveBeenCalledWith(undefined, [1])
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onReturn).toHaveBeenCalledWith(data, 2)
  })

  it('should wrap an async function with the provided spy strategy', async () => {
    const originalFunc = vitest.fn(async (n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy)
    expect(await wrappedFunc(1)).toBe(2)
    expect(spyStrategy.onInvoke).toHaveBeenCalledWith(undefined, [1])
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onReturn).toHaveBeenCalledWith(data, 2)
  })

  it('should wrap a known sync function with the provided spy strategy', () => {
    const originalFunc = vitest.fn((n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { async: false })
    expect(wrappedFunc(1)).toBe(2)
    expect(spyStrategy.onInvoke).toHaveBeenCalledWith(undefined, [1])
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onReturn).toHaveBeenCalledWith(data, 2)
  })

  it('should wrap a known async function with the provided spy strategy', async () => {
    const originalFunc = vitest.fn(async (n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { async: true })
    expect(await wrappedFunc(1)).toBe(2)
    expect(spyStrategy.onInvoke).toHaveBeenCalledWith(undefined, [1])
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onReturn).toHaveBeenCalledWith(data, 2)
  })

  it('should not wrap a function if the provided ignore predicate returns true when called with 2 arguments', () => {
    const ignorePredicate = vitest.fn((...args: unknown[]) => {
      return args.length === 2
    })
    const originalFunc = vitest.fn()
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { ignore: ignorePredicate })
    expect(wrappedFunc).toBe(originalFunc)
  })

  it('should ignore function calls if the provided ignore predicate returns true when called with 3 arguments', () => {
    const ignorePredicate = vitest.fn((...args: unknown[]) => {
      return args.length === 3
    })
    const originalFunc = vitest.fn()
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { ignore: ignorePredicate })
    expect(wrappedFunc).not.toBe(originalFunc)
    wrappedFunc()
    expect(ignorePredicate).toHaveBeenCalledWith(originalFunc, spyStrategy)
    expect(originalFunc).toHaveBeenCalled()
    expect(spyStrategy.onInvoke).not.toHaveBeenCalled()
    expect(spyStrategy.onReturn).not.toHaveBeenCalled()
  })

  it('should not ignore function calls if the provided ignore predicate always returns false', () => {
    const ignorePredicate = vitest.fn(() => {
      return false
    })
    const originalFunc = vitest.fn((n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { ignore: ignorePredicate })
    expect(wrappedFunc).not.toBe(originalFunc)
    expect(wrappedFunc(1)).toBe(2)
    expect(spyStrategy.onInvoke).toHaveBeenCalledWith(undefined, [1])
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onReturn).toHaveBeenCalledWith(data, 2)
  })

  // wrapSync ignore branches
  it('should return original sync function when ignore(2 args) returns true with async:false', () => {
    const ignorePredicate = vitest.fn((...args: unknown[]) => {
      return args.length === 2
    })
    const originalFunc = vitest.fn()
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { async: false, ignore: ignorePredicate })
    expect(wrappedFunc).toBe(originalFunc)
  })

  it('should skip spy for sync when ignore(3 args) returns true with async:false', () => {
    const ignorePredicate = vitest.fn((...args: unknown[]) => {
      return args.length === 3
    })
    const originalFunc = vitest.fn((n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { async: false, ignore: ignorePredicate })
    expect(wrappedFunc).not.toBe(originalFunc)
    expect(wrappedFunc(1)).toBe(2)
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onInvoke).not.toHaveBeenCalled()
    expect(spyStrategy.onReturn).not.toHaveBeenCalled()
  })

  // wrapAsync ignore branches
  it('should return original async function when ignore(2 args) returns true with async:true', () => {
    const ignorePredicate = vitest.fn((...args: unknown[]) => {
      return args.length === 2
    })
    const originalFunc = vitest.fn(async () => {})
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { async: true, ignore: ignorePredicate })
    expect(wrappedFunc).toBe(originalFunc)
  })

  it('should skip spy for async when ignore(3 args) returns true with async:true', async () => {
    const ignorePredicate = vitest.fn((...args: unknown[]) => {
      return args.length === 3
    })
    const originalFunc = vitest.fn(async (n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { async: true, ignore: ignorePredicate })
    expect(wrappedFunc).not.toBe(originalFunc)
    expect(await wrappedFunc(1)).toBe(2)
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onInvoke).not.toHaveBeenCalled()
    expect(spyStrategy.onReturn).not.toHaveBeenCalled()
  })

  // wrapMaybeAsync: sync function returning promise
  it('should handle sync function that returns a promise (maybeAsync path)', async () => {
    const originalFunc = vitest.fn((n: number) => {
      return Promise.resolve(n + 1)
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy)
    expect(await wrappedFunc(1)).toBe(2)
    expect(spyStrategy.onInvoke).toHaveBeenCalledWith(undefined, [1])
    expect(spyStrategy.onReturn).toHaveBeenCalledWith(data, 2)
  })

  // wrapMaybeAsync: ignore(3 args) path
  it('should skip spy for maybeAsync when ignore(3 args) returns true', () => {
    const ignorePredicate = vitest.fn((...args: unknown[]) => {
      return args.length === 3
    })
    const originalFunc = vitest.fn((n: number) => {
      return n + 1
    })
    const wrappedFunc = functionSpy(originalFunc, spyStrategy, { ignore: ignorePredicate })
    expect(wrappedFunc).not.toBe(originalFunc)
    wrappedFunc(1)
    expect(originalFunc).toHaveBeenCalledWith(1)
    expect(spyStrategy.onInvoke).not.toHaveBeenCalled()
  })
})
