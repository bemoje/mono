# @mono/tschema

TypeScript schema validation utilities based on TypeBox.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Usage

### Assertion & Validation

Assert that unknown data conforms to a [TypeBox](https://github.com/sinclairzx81/typebox) schema. Throws a
structured validation error containing individual violation details.

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

## API Reference

| Export                  | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `assertValidSchema`     | Asserts data matches a schema, throws `SchemaValidationError` with details if invalid     |
| `SchemaValidationError` | Error thrown during failed validation, containing the value and an array of `ValueError`s |
