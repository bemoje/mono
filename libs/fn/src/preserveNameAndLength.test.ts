/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from 'vitest'
import { preserveNameAndLength } from './preserveNameAndLength'

describe(preserveNameAndLength.name, () => {
  it('should preserve the name and length of a function', () => {
    const sourceFn = function (a: number, b: number) {}

    const targetFn = function (x: number) {}

    const adjustedFn = preserveNameAndLength(sourceFn, targetFn)

    expect(adjustedFn.name).toBe(sourceFn.name)
    expect(adjustedFn.length).toBe(sourceFn.length)
  })

  it('should adjust the length of a function by the specified amount', () => {
    const sourceFn = function (a: number, b: number) {}

    const targetFn = function (x: number) {}

    const adjustBy = 2
    const adjustedFn = preserveNameAndLength(sourceFn, targetFn, adjustBy)

    expect(adjustedFn.length).toBe(sourceFn.length + adjustBy)
  })

  it('should preserve the name and length of a class constructor', () => {
    class SourceClass {
      constructor(a: number, b: number) {}
    }

    class TargetClass {
      constructor(x: number) {}
    }

    const adjustedClass = preserveNameAndLength(SourceClass, TargetClass)

    expect(adjustedClass.name).toBe(SourceClass.name)
    expect(adjustedClass.length).toBe(SourceClass.length)
  })

  it('should adjust the length of a class constructor by the specified amount', () => {
    class SourceClass {
      constructor(a: number, b: number) {}
    }

    class TargetClass {
      constructor(x: number) {}
    }

    const adjustBy = 2
    const adjustedClass = preserveNameAndLength(SourceClass, TargetClass, adjustBy)

    expect(adjustedClass.length).toBe(SourceClass.length + adjustBy)
  })
})
