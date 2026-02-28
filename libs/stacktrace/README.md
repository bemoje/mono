# @bemoje/stacktrace

Beautiful, color-formatted stack trace output for Node.js errors with syntax-highlighted file paths and structured error properties.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/stacktrace
```

## Usage

### Pretty Print an Error

```ts
import { prettyStackTrace } from '@bemoje/stacktrace'

try {
  throw new Error('Something went wrong')
} catch (error) {
  console.error(prettyStackTrace(error as Error))
}
// Error: Something went wrong        (red)
// stack:
//   functionName    src/index.ts:12:5   (source files highlighted in red)
//   otherMethod     node_modules/...    (dependencies in yellow)
//   internal        node:internal/...   (node internals in gray)
```

### Enable Globally for Uncaught Exceptions

```ts
import { enablePrettyStackTrace } from '@bemoje/stacktrace'

enablePrettyStackTrace()
// All uncaught exceptions will now be printed with color-formatted stack traces
```

### Options

```ts
import { prettyStackTrace } from '@bemoje/stacktrace'

const error = new Error('fail')

// Omit stack trace, show only message and properties
prettyStackTrace(error, { omitStack: true })

// Omit custom properties, show only message and stack
prettyStackTrace(error, { omitProps: true })
```

### Custom Error Properties

Extra properties on error objects are automatically displayed:

```ts
const error = new Error('Validation failed')
;(error as any).field = 'email'
;(error as any).value = 'not-an-email'

console.error(prettyStackTrace(error))
// Error: Validation failed
// { field: 'email', value: 'not-an-email' }
// stack:
//   ...
```

## API Reference

| Export                   | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `prettyStackTrace`       | Format an Error into a colorized, readable string                   |
| `enablePrettyStackTrace` | Register a global uncaught exception handler with pretty formatting |
