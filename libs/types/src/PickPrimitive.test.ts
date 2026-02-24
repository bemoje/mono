import { describe } from "vitest";
import { it } from "vitest";
import { expect } from "vitest";
import type { PickPrimitive } from './PickPrimitive'

describe('PickPrimitive', () => {
  it('compile-time type assertions', () => {
    type TestObj = {
      name: string
      count: number
      active: boolean
      tags: string[]
      nested: { a: number }
      maybe: string | undefined
    }

    type Result = PickPrimitive<TestObj>

    // Should include only primitive properties
    const _check: Result = { name: '', count: 0, active: false, maybe: undefined }

    // @ts-expect-error - 'tags' is not a primitive
    const _fail1: Result = { name: '', count: 0, active: false, maybe: undefined, tags: [] }

    // @ts-expect-error - 'nested' is not a primitive
    const _fail2: Result = { name: '', count: 0, active: false, maybe: undefined, nested: { a: 1 } }

    expect(_check).toBeDefined()
    expect(_fail1).toBeDefined()
    expect(_fail2).toBeDefined()
  })
})
