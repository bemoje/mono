import { describe, expect, it } from 'vitest'
import { toError } from './toError'

describe(toError.name, () => {
  it('should return the same error object if input is an instance of Error', () => {
    const error = new Error('Test error')
    const result = toError(error)
    expect(result).toBe(error)
  })

  it('should return a new Error object if input is not an instance of Error', () => {
    const error = 'Test error'
    const result = toError(error)
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe(error)
  })
})
