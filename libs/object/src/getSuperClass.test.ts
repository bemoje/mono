import { describe } from 'vitest'
import { expect } from 'vitest'
import { getSuperClass } from './getSuperClass'
import { it } from 'vitest'

describe(getSuperClass.name, () => {
  it('should return the immediate superclass', () => {
    class A {}
    class B extends A {}
    expect(getSuperClass(B)).toBe(A)
  })

  it('should return Object for a class with no explicit superclass', () => {
    class A {}
    expect(getSuperClass(A)).toBe(Object)
  })

  it('should return Object when chain is empty', () => {
    expect(getSuperClass(Object)).toBe(Object)
  })
})
