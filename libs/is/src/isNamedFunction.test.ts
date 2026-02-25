import { describe } from 'vitest'
import { expect } from 'vitest'
import { isNamedFunction } from './isNamedFunction'
import { it } from 'vitest'

describe(isNamedFunction.name, () => {
  describe('valid', () => {
    it('named function', () => {
      expect(isNamedFunction(function namedFunction() {})).toBe(true)
    })

    it('named arrow function', () => {
      const arrowFunction = () => {}
      expect(isNamedFunction(arrowFunction)).toBe(true)
    })

    it('constructor', () => {
      expect(isNamedFunction(class Class {})).toBe(true)
    })
  })

  describe('invalid', () => {
    it('unnamed arrow function', () => {
      expect(isNamedFunction(() => {})).toBe(false)
    })

    it('not a function', () => {
      expect(isNamedFunction(1)).toBe(false)
    })
  })
})
