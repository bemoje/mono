import { objForEach } from './objForEach'
import { describe, expect, it, vi } from 'vitest'

describe('objForEach', () => {
  it('should apply the callback to each key-value pair in the object', () => {
    const object = { a: 1, b: 2, c: 3 }
    const callback = vi.fn()
    objForEach(object, callback)
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 'a')
    expect(callback).toHaveBeenCalledWith(2, 'b')
    expect(callback).toHaveBeenCalledWith(3, 'c')
  })

  it('should return the original object', () => {
    const object = { a: 1, b: 2, c: 3 }
    const callback = vi.fn()
    const result = objForEach(object, callback)
    expect(result).toBe(object)
  })

  it('should handle an empty object', () => {
    const object = {}
    const callback = vi.fn()
    objForEach(object, callback)
    expect(callback).not.toHaveBeenCalled()
  })
})
