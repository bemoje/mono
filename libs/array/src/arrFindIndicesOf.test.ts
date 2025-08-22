import { describe, expect, it, vi } from 'vitest'
import { arrFindIndicesOf } from './arrFindIndicesOf'

describe(arrFindIndicesOf.name, () => {
  it('should return an empty array if the input array is empty', () => {
    const input: number[] = []
    const predicate = vi.fn()
    const result = arrFindIndicesOf(input, predicate)
    expect(result).toEqual([])
    expect(predicate).not.toHaveBeenCalled()
  })

  it('should return an empty array if no elements in the input array satisfy the predicate', () => {
    const input = [1, 2, 3, 4, 5]
    const predicate = vi.fn((value) => value > 5)
    const result = arrFindIndicesOf(input, predicate)
    expect(result).toEqual([])
    expect(predicate).toHaveBeenCalledTimes(5)
    expect(predicate).toHaveBeenCalledWith(1)
    expect(predicate).toHaveBeenCalledWith(2)
    expect(predicate).toHaveBeenCalledWith(3)
    expect(predicate).toHaveBeenCalledWith(4)
    expect(predicate).toHaveBeenCalledWith(5)
  })

  it('should return an array of indices where the predicate returns true for the corresponding elements', () => {
    const input = [1, 2, 3, 4, 5]
    const predicate = vi.fn((value) => value % 2 === 0)
    const result = arrFindIndicesOf(input, predicate)
    expect(result).toEqual([1, 3])
    expect(predicate).toHaveBeenCalledTimes(5)
    expect(predicate).toHaveBeenCalledWith(1)
    expect(predicate).toHaveBeenCalledWith(2)
    expect(predicate).toHaveBeenCalledWith(3)
    expect(predicate).toHaveBeenCalledWith(4)
    expect(predicate).toHaveBeenCalledWith(5)
  })

  it('should handle multiple elements satisfying the predicate', () => {
    const input = [1, 2, 3, 4, 5]
    const predicate = vi.fn((value) => value > 2)
    const result = arrFindIndicesOf(input, predicate)
    expect(result).toEqual([2, 3, 4])
    expect(predicate).toHaveBeenCalledTimes(5)
    expect(predicate).toHaveBeenCalledWith(1)
    expect(predicate).toHaveBeenCalledWith(2)
    expect(predicate).toHaveBeenCalledWith(3)
    expect(predicate).toHaveBeenCalledWith(4)
    expect(predicate).toHaveBeenCalledWith(5)
  })
})
