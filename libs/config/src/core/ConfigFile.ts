import { ConfigDataStrategy } from '../interfaces/ConfigDataStrategy'
import { ConfigValidationStrategy } from '../interfaces/ConfigValidationStrategy'
import { JsonFileStrategy } from '../strategies/JsonFileStrategy'
import { SchemaConfigStrategy } from '../strategies/SchemaConfigStrategy'
import { Static, TSchema } from '@sinclair/typebox'

/**
 * Configuration file manager that provides schema validation and file I/O using the Strategy pattern.
 */
export class ConfigFile<Schema extends TSchema> {
  protected static instances = new Map<string, ConfigFile<TSchema>>()
  protected readonly data!: ConfigDataStrategy<Static<Schema>>
  protected readonly validation!: ConfigValidationStrategy<Static<Schema>>

  readonly filepath!: string
  readonly schema!: Schema

  constructor(schema: Schema, filepath: string) {
    if (ConfigFile.instances.has(filepath)) {
      return ConfigFile.instances.get(filepath) as ConfigFile<Schema>
    } else {
      ConfigFile.instances.set(filepath, this)
    }

    this.schema = schema
    this.filepath = filepath
    this.data = new JsonFileStrategy<Static<Schema>>(filepath)
    this.validation = new SchemaConfigStrategy(schema)
  }

  load() {
    const config = this.data.load()
    const merged = this.validation.applyDefaults(config)
    this.data.save(merged)
    return merged
  }

  update(cb: (config: Static<Schema>) => Static<Schema>) {
    const merged = this.validation.applyDefaults(cb(this.load()))
    this.data.save(merged)
    return merged
  }
}
