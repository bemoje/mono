import { isNamedFunctionArray } from './isNamedFunctionArray'
import { describe, expect, it } from 'vitest'

describe(isNamedFunctionArray.name, () => {
  describe('valid', () => {
    it('named function array', () => {
      expect(isNamedFunctionArray([function f() {}])).toBe(true)
    })
  })
  describe('invalid', () => {
    it('not named function array', () => {
      expect(isNamedFunctionArray([() => {}])).toBe(false)
    })
  })
})
