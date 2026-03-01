import { describe } from 'vitest'
import { expect } from 'vitest'
import { isValueDescriptor } from './isValueDescriptor'
import { it } from 'vitest'

describe(isValueDescriptor.name, () => {
  it('examples', () => {
    expect(() => {
      // Simple value descriptor
      const valueDescriptor = { value: 'test', writable: true, enumerable: true, configurable: true }
      expect(isValueDescriptor(valueDescriptor)).toBe(true)

      // Accessor descriptor
      const accessorDescriptor = {
        get: () => {
          return 'test'
        },
        enumerable: true,
        configurable: true,
      }
      expect(isValueDescriptor(accessorDescriptor)).toBe(false)
    }).not.toThrow()
  })

  describe('returns false', () => {
    it('when descriptor is undefined', () => {
      expect(isValueDescriptor(undefined)).toBe(false)
    })

    it('when descriptor has a getter', () => {
      const descriptor = {
        get: () => {
          return 'value'
        },
        enumerable: true,
        configurable: true,
      }
      expect(isValueDescriptor(descriptor)).toBe(false)
    })

    it('when descriptor has a setter', () => {
      const descriptor = { set: (v: string) => {}, enumerable: true, configurable: true }
      expect(isValueDescriptor(descriptor)).toBe(false)
    })

    it('when descriptor has both getter and setter', () => {
      const descriptor = {
        get: () => {
          return 'value'
        },
        set: (v: string) => {},
        enumerable: true,
        configurable: true,
      }
      expect(isValueDescriptor(descriptor)).toBe(false)
    })
  })

  describe('returns true', () => {
    it('for a descriptor with a value property', () => {
      const descriptor = { value: 'test', writable: true, enumerable: true, configurable: true }
      expect(isValueDescriptor(descriptor)).toBe(true)
    })

    it('for a descriptor with only attribute properties', () => {
      const descriptor = { writable: false, enumerable: false, configurable: false }
      expect(isValueDescriptor(descriptor)).toBe(true)
    })

    it('for an empty object descriptor', () => {
      const descriptor = {}
      expect(isValueDescriptor(descriptor)).toBe(true)
    })
  })
})
