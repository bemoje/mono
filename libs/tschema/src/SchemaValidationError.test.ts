import { describe, expect, it } from 'vitest'
import { SchemaValidationError } from './SchemaValidationError'

describe('SchemaValidationError', () => {
  it('should create an instance with the correct properties', () => {
    const errors = [{ field: 'name', message: 'Invalid name' }]
    const value = { name: 'John' }
    const message = 'Custom error message'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = new SchemaValidationError(errors as any, value, message)

    expect(error).toBeInstanceOf(SchemaValidationError)
    expect(error.errors).toEqual(errors)
    expect(error.value).toEqual(value)
    expect(error.message).toEqual(message)
  })
})
