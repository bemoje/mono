import { describe, expect, it } from 'vitest'
import { arrEachToString } from './arrEachToString'

describe('arrEachToString', () => {
  it('should return an empty array when given an empty array', () => {
    const result = arrEachToString([])
    expect(result).toEqual([])
  })

  it('should return an array of strings when given an array of numbers', () => {
    const result = arrEachToString([1, 2, 3])
    expect(result).toEqual(['1', '2', '3'])
  })

  it('should return an array of strings when given an array of booleans', () => {
    const result = arrEachToString([true, false])
    expect(result).toEqual(['true', 'false'])
  })

  it('should return an array of strings when given an array of strings', () => {
    const result = arrEachToString(['hello', 'world'])
    expect(result).toEqual(['hello', 'world'])
  })

  it('should return an array of strings when given an array of objects', () => {
    const result = arrEachToString([{ name: 'John' }, { name: 'Jane' }])
    expect(result).toEqual(['[object Object]', '[object Object]'])
  })
})
