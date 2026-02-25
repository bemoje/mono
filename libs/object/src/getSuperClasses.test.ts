import { describe } from 'vitest'
import { expect } from 'vitest'
import { getSuperClasses } from './getSuperClasses'
import { it } from 'vitest'

describe(getSuperClasses.name, () => {
  class A {}
  class B extends A {}
  class C extends B {}

  it('should return superclasses excluding self by default', () => {
    const result = getSuperClasses(C)
    expect(result).toEqual([B, A, Object])
  })

  it('should include self when includeSelf is true', () => {
    const result = getSuperClasses(C, { includeSelf: true })
    expect(result).toEqual([C, B, A, Object])
  })

  it('should return [Object] for a base class', () => {
    const result = getSuperClasses(A)
    expect(result).toEqual([Object])
  })

  it('should work with an instance instead of a constructor', () => {
    const result = getSuperClasses(new C())
    expect(result).toEqual([B, A, Object])
  })

  it('should work with an instance and includeSelf', () => {
    const result = getSuperClasses(new C(), { includeSelf: true })
    expect(result).toEqual([C, B, A, Object])
  })

  it('should work with a plain object', () => {
    const result = getSuperClasses({})
    expect(result).toEqual([Object])
  })

  it('should default includeSelf to false when options is undefined', () => {
    const result = getSuperClasses(B)
    expect(result).toEqual([A, Object])
  })
})
