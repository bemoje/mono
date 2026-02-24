import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { SchemaValidationError } from './SchemaValidationError'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

describe('SchemaValidationError', () => {
  it('should create an instance from an array of errors', () => {
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

  it('should create an instance from a ValueErrorIterator', () => {
    const schema = Type.Object({ name: Type.String() })
    const value = { name: 123 }
    const errorIterator = Value.Errors(schema, value)

    const error = new SchemaValidationError(errorIterator, value, 'Validation failed')

    expect(error).toBeInstanceOf(SchemaValidationError)
    expect(error.errors.length).toBeGreaterThan(0)
    expect(error.value).toEqual(value)
  })

  it('should create an instance from a TSchema', () => {
    const schema = Type.Object({ name: Type.String() })
    const value = { name: 123 }

    const error = new SchemaValidationError(schema, value, 'Schema validation failed')

    expect(error).toBeInstanceOf(SchemaValidationError)
    expect(error.errors.length).toBeGreaterThan(0)
    expect(error.value).toEqual(value)
  })
})
