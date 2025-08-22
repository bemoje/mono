import { describe, it, expect } from 'vitest'
import { bindArgs } from './bindArgs'

describe(bindArgs.name, () => {
  // Helper function for testing
  function testFn(a: number, b: string, c: boolean) {
    return [a, b, c] as const
  }

  it('should bind argument at index 0', () => {
    const boundFn = bindArgs(testFn, { 0: 999 })
    const result = boundFn('str', true)
    expect(result).toEqual([999, 'str', true])
  })

  it('should bind argument at index 1', () => {
    const boundFn = bindArgs(testFn, { 1: 'str' })
    const result = boundFn(999, true)
    expect(result).toEqual([999, 'str', true])
  })

  it('should bind argument at index 2', () => {
    const boundFn = bindArgs(testFn, { 2: true })
    const result = boundFn(999, 'str')
    expect(result).toEqual([999, 'str', true])
  })

  it('should bind all arguments', () => {
    const boundFn = bindArgs(testFn, { 0: 999, 1: 'str', 2: true })
    const result = boundFn()
    expect(result).toEqual([999, 'str', true])
  })

  it('should bind all arguments in different order', () => {
    const boundFn = bindArgs(testFn, { 1: 'str', 2: true, 0: 999 })
    const result = boundFn()
    expect(result).toEqual([999, 'str', true])
  })

  it('should bind multiple arguments and accept remaining ones', () => {
    const boundFn = bindArgs(testFn, { 2: true, 0: 999 })
    const result = boundFn('str')
    expect(result).toEqual([999, 'str', true])
  })

  it('should handle functions with different return types', () => {
    function mathFn(x: number, y: number, z: number): number {
      return x + y + z
    }

    const boundMathFn = bindArgs(mathFn, { 1: 10 })
    const result = boundMathFn(5, 15)
    expect(result).toBe(30)
  })

  it('should handle functions with no bound arguments', () => {
    const boundFn = bindArgs(testFn, {})
    const result = boundFn(123, 'hello', false)
    expect(result).toEqual([123, 'hello', false])
  })
})
