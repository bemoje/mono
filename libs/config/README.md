# @bemoje/config

Configuration file management with JSON persistence and TypeBox schema validation.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**ConfigFile**](./src/core/ConfigFile.ts): Configuration file manager that provides schema validation and file I/O using the Strategy pattern. Ensures that only one instance of ConfigFile exists per file path, and allows for loading and updating configuration data with validation and default values applied.
- [**JsonFileStrategy**](./src/strategies/JsonFileStrategy.ts): Strategy for loading and saving configuration data as JSON files.
- [**SchemaConfigStrategy**](./src/strategies/SchemaConfigStrategy.ts): Strategy for validating configuration data against a TypeBox schema and applying default values.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/config
```

## Features

- Schema-validated configuration with TypeBox
- Automatic default value merging
- JSON file persistence strategy
- Singleton pattern per filepath
- Strategy-based architecture for extensibility

## Usage

### Basic Configuration

```ts
import { ConfigFile } from '@bemoje/config'
import { Type } from '@sinclair/typebox'

const schema = Type.Object({
  port: Type.Number({ default: 3000 }),
  host: Type.String({ default: 'localhost' }),
  debug: Type.Boolean({ default: false }),
})

const config = new ConfigFile(schema, './config.json')

// Load config (creates file with defaults if it doesn't exist)
const data = config.load()
// => { port: 3000, host: 'localhost', debug: false }

// Update config
config.update((current) => ({ ...current, port: 8080, debug: true }))
```

### Custom Strategies

The architecture uses the Strategy pattern for data I/O and validation:

```ts
import { JsonFileStrategy } from '@bemoje/config'

// JSON file strategy handles read/write
const dataStrategy = new JsonFileStrategy<MyConfig>('./config.json')
dataStrategy.load() // => parsed JSON or undefined
dataStrategy.save({ port: 3000 })
```

```ts
import { SchemaConfigStrategy } from '@bemoje/config'
import { Type } from '@sinclair/typebox'

const schema = Type.Object({ name: Type.String(), version: Type.String({ default: '1.0.0' }) })

const validation = new SchemaConfigStrategy(schema)

// Validate data
validation.isValid({ name: 'app', version: '2.0.0' }) // => true

// Apply defaults to partial data
validation.applyDefaults({ name: 'app' })
// => { name: 'app', version: '1.0.0' }
```
