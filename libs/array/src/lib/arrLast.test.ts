import { arrLast } from './arrLast'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(arrLast.name, () => {
  it('should return the last element of a non-empty array', () => {
    const array = [1, 2, 3]
    const result = arrLast(array)
    expect(result).toBe(3)
  })

  it('should throw an error when called with an empty array', () => {
    expect(() => {
      return arrLast([])
    }).toThrow('Cannot get last element of empty array.')
  })

  it('should return the last element of an array with a single element', () => {
    const array = ['a']
    const result = arrLast(array)
    expect(result).toBe('a')
  })

  it('should return the last element of an array with multiple elements of different types', () => {
    const array = [1, 'a', false, null]
    const result = arrLast(array)
    expect(result).toBe(null)
  })
})
