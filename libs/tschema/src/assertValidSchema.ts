import { Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { SchemaValidationError } from './SchemaValidationError'
import { TSchema } from '@sinclair/typebox'

/**
 * Asserts that data conforms to a TypeBox schema, throwing a SchemaValidationError if it doesn't.
 */
export function assertValidSchema<Schema extends TSchema>(
  schema: Schema,
  data: unknown,
  message: string,
): asserts data is Static<Schema> {
  const isValid = Value.Check(schema, data)
  if (!isValid) {
    throw new SchemaValidationError(Value.Errors(schema, data), data, message)
  }
}
