import { describe, expect, it, vitest } from 'vitest'
import { arrGetOrDefault } from './arrGetOrDefault'

describe(arrGetOrDefault.name, () => {
  it('should return existing value', () => {
    const arr = [10]
    const callback = vitest.fn()
    expect(arrGetOrDefault(arr, 0, callback)).toBe(10)
    expect(callback).not.toHaveBeenCalled()
  })
  it('should set and return value if index is missing', () => {
    const arr: number[] = []
    const callback = vitest.fn().mockReturnValue(7)
    expect(arrGetOrDefault(arr, 2, callback)).toBe(7)
    expect(arr[2]).toBe(7)
    expect(callback).toHaveBeenCalledWith(2)
  })
  it('should handle undefined value at index', () => {
    const arr = []
    arr[1] = undefined
    const callback = vitest.fn().mockReturnValue(5)
    expect(arrGetOrDefault(arr, 0, callback)).toBe(5)
    expect(arr[0]).toBe(5)
  })
})
