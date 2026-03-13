# @mono/tschema

TypeScript schema validation utilities based on TypeBox.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**SchemaValidationError**](./src/SchemaValidationError.ts): Error thrown when a value does not match a given schema. Contains an array of ValueError instances with details about each violation.
- [**assertValidSchema**](./src/assertValidSchema.ts): Asserts that data conforms to a TypeBox schema, throwing a SchemaValidationError if it doesn't.

<!-- EXPORTS_END -->

## Usage

### Assertion & Validation

Assert that unknown data conforms to a [TypeBox](https://github.com/sinclairzx81/typebox) schema. Throws a structured validation error containing individual violation details.

```ts
import { Type } from '@sinclair/typebox'
import { assertValidSchema, SchemaValidationError } from '@mono/tschema'

const userSchema = Type.Object({ name: Type.String(), age: Type.Number() })

const data = { name: 'Alice', age: 'thirty' }

try {
  assertValidSchema(userSchema, data, 'Invalid user data')
} catch (error) {
  if (error instanceof SchemaValidationError) {
    console.error(error.message) // 'Invalid user data'
    console.error(error.value) // The originally validated object
    console.error(error.errors) // Array of specific TypeBox ValueErrors
  }
}
```
