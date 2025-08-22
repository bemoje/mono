import { describe, expect, it } from 'vitest'

import { objIsEmpty } from './objIsEmpty'

describe('objIsEmpty', () => {
  it('should return true for an empty object', () => {
    const obj = {}
    expect(objIsEmpty(obj)).toBe(true)
  })

  it('should return false for an object with one key', () => {
    const obj = { key: 'value' }
    expect(objIsEmpty(obj)).toBe(false)
  })

  it('should return false for an object with multiple keys', () => {
    const obj = { key1: 'value1', key2: 'value2', key3: 'value3' }
    expect(objIsEmpty(obj)).toBe(false)
  })

  it('should return false for an object with undefined value', () => {
    const obj = { key: undefined }
    expect(objIsEmpty(obj)).toBe(false)
  })

  it('should return false for an object with null value', () => {
    const obj = { key: null }
    expect(objIsEmpty(obj)).toBe(false)
  })

  it('should return false for an object with empty string value', () => {
    const obj = { key: '' }
    expect(objIsEmpty(obj)).toBe(false)
  })

  it('should return false for an object with zero value', () => {
    const obj = { key: 0 }
    expect(objIsEmpty(obj)).toBe(false)
  })
})
