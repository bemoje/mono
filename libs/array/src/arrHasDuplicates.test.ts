import { describe, expect, it } from 'vitest'
import { arrHasDuplicates } from './arrHasDuplicates'

describe(arrHasDuplicates.name, () => {
  it('should return false for an empty array', () => {
    expect(arrHasDuplicates([])).toBe(false)
  })

  it('should return false for an array with no duplicates', () => {
    expect(arrHasDuplicates([1, 2, 3])).toBe(false)
  })

  it('should return true for an array with duplicates', () => {
    expect(arrHasDuplicates([1, 2, 2, 3])).toBe(true)
  })

  it('should return true for an array with multiple duplicates', () => {
    expect(arrHasDuplicates([1, 2, 2, 3, 3, 3])).toBe(true)
  })

  it('should return true for an array with duplicate null values', () => {
    expect(arrHasDuplicates([null, null])).toBe(true)
  })

  it('should return true for an array with duplicate undefined values', () => {
    expect(arrHasDuplicates([undefined, undefined])).toBe(true)
  })
})
