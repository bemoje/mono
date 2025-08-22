import { isNull } from './isNull'
import { describe, expect, it } from 'vitest'

describe(isNull.name, () => {
  describe('valid', () => {
    it('null', () => {
      expect(isNull(null)).toBe(true)
    })
  })

  describe('invalid', () => {
    it('false', () => {
      expect(isNull(false)).toBe(false)
    })

    it('undefined', () => {
      expect(isNull(undefined)).toBe(false)
    })

    it('zero', () => {
      expect(isNull(0)).toBe(false)
    })

    it('empty string', () => {
      expect(isNull('')).toBe(false)
    })
  })
})
