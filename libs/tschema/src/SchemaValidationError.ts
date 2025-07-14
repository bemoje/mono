import { TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { ValueError, ValueErrorIterator } from '@sinclair/typebox/compiler'

/**
 * Error thrown when a value does not match a given schema.
 * Contains an array of ValueError instances with details about each violation.
 */
export class SchemaValidationError extends Error {
  readonly value: unknown
  readonly errors: ValueError[]
  constructor(errors: TSchema | ValueError[] | ValueErrorIterator, value: unknown, message: string) {
    super(message)
    this.value = value
    this.errors = Array.isArray(errors)
      ? errors
      : errors instanceof ValueErrorIterator
        ? Array.from(errors)
        : Array.from(Value.Errors(errors, value))
  }
}
