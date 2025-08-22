import { assertValidSchema } from '@mono/tschema'
import { ConfigValidationStrategy } from '../interfaces/ConfigValidationStrategy'
import { Static, TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

/**
 * Strategy for validating configuration data against a TypeBox schema and applying default values.
 */
export class SchemaConfigStrategy<Schema extends TSchema> implements ConfigValidationStrategy<Static<Schema>> {
  constructor(readonly schema: Schema) {}

  isValid(config: unknown): config is Static<Schema> {
    return Value.Check(this.schema, config)
  }

  assertValid(config: unknown): asserts config is Static<Schema> {
    assertValidSchema(this.schema, config, 'Invalid config.')
  }

  applyDefaults(config: Partial<Static<Schema>> = {}): Static<Schema> {
    // Use Value.Default to properly apply default values from schema
    const merged = Value.Default(this.schema, config)
    this.assertValid(merged)
    return merged
  }
}
