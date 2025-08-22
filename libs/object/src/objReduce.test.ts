import { objReduce } from './objReduce'
import { describe, expect, it, vi } from 'vitest'

describe('objReduce', () => {
  it('should reduce an object to a single value', () => {
    const object = { a: 1, b: 2, c: 3 }
    const callback = (accum: number, value: number) => accum + value
    const result = objReduce(object, callback, 0)
    expect(result).toBe(6)
  })

  it('should pass the key to the callback', () => {
    const object = { a: 1, b: 2, c: 3 }
    const callback = vi.fn((accum: number, value: number, key: string) => accum + value)
    objReduce(object, callback, 0)
    expect(callback).toHaveBeenCalledWith(0, 1, 'a')
    expect(callback).toHaveBeenCalledWith(1, 2, 'b')
    expect(callback).toHaveBeenCalledWith(3, 3, 'c')
  })

  it('should handle an object with one key-value pair', () => {
    const object = { a: 1 }
    const callback = (accum: number, value: number) => accum + value
    const result = objReduce(object, callback, 0)
    expect(result).toBe(1)
  })
})
