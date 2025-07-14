# Style Guide

The mono repository follows strict TypeScript patterns with comprehensive utility functions for object manipulation, functional programming, type definitions, and developer tooling.

## Workspaces

Workspaces directories, eg. `libs/`, `apps/`, and `packages/` are defined in [(`package.json`).workspaces](../package.json).

## Architecture & Structure

### Configuration

- **Package Manager**: Use `yarn`
- **Workspaces**: `apps/*`, `packages/*`, `libs/*` (Yarn 4.3.1 workspaces)
- **Build System**: ESBuild with consistent configuration across packages
- **Module System**: ESNext modules, target Node 21+
- **Package Manager**: Yarn v4 with strict workspace management

### Directory Structure Patterns

#### `libs/<package-name>`

```
libs/<package-name>/
├── esbuild.mjs           # Build configuration (standardized)
├── eslint.config.js      # Extends root ESLint config
├── package.json          # Package metadata with build/lint scripts
├── README.md             # Package documentation
├── tsconfig.json         # Extends ../../tsconfig.json
└── src/
    ├── index.ts          # Barrel export file
    ├── **/*.ts           # Implementation files
    └── **/*.test.ts      # Test files (Vitest)
```

## Tasks and scripts

**General**:

- Use `yarn` not `npm`
- To run specific test(s), use `yarn test <GLOB_PATTERN>`

## Npm scripts (from root)

- `yarn build`: Build all packages
- `yarn lint`: Lint all packages
- `yarn test`: Run all tests with coverage
- `yarn typecheck`: TypeScript compilation check
- `yarn format`: Format code with Prettier
- `yarn precommit`: Complete CI pipeline locally

See [package.json](../package.json) for more scripts.

## Coding Standards & Patterns

### Import/Export Patterns

- **`src/`**: All source code files should be placed in the `src/` directory.
- **`src/*.ts`**: The `src/` dir should not have any subdirectories by default. If it does, it needs special handling in scripts/configs because index.ts files are auto-generated.
- **`src/index.ts`**: Most `src/index.ts` files are auto-generated barrel files that export every named export from every file in the package.
- **public API exports**: Use named export for anything public facing. No default exports.
- **public API files**: A file must at most have one named export which should match its filename and are public facing.
- **PascalCase naming exception**: Functions that are constructor-like (return other functions, often validators) should use PascalCase naming to indicate their constructor semantics, e.g., `IsLength()`, `IsFileExt()`.
- **internal files**: Helpers, utils and other internal objects should stay in the file they are used in and are not exported, unless:
  - If used in multiple files, move it to a new file, and (ONLY!) default export it.
  - If internal helpers need unit testing (should not be be the case as it indicated bad untestable design), either refactor to more testable design or otherwise move it to a new file, default export it and create test file matching that filename.

### Example `libs/` directory refactoring

```typescript
// Use named exports for functions to be exported out of the workspace module.
export function one() {
  internalHelperUsedInOnlyOneFile()
  internalHelperUsedInMultipleFiles()
  internalHelperThatNeedsUnitTests()
}

// move to its own file and default export it from there. No named export.
export function two() {
  internalHelperUsedInMultipleFiles()
  internalHelperThatNeedsUnitTests()
}

// stays in this file. no export.
function internalHelperUsedInOnlyOneFile() {}

// move to its own file and default export it from there. No named export.
function internalHelperUsedInMultipleFiles() {}

// move to its own file and default export it from there. No named export.
function internalHelperThatNeedsUnitTests() {}
```

### Type Definitions

- **types**: Use `type` for simple type definitions and structs that describe the shape/structure of data.
- **interfaces**: Use `interface` for actual interfaces that are implemented by classes or similar and are important programmer instructions/contracts, usually to enforce a design pattern.
  - These must be public facing named exports and should have their own file.
  - These should have good TSDOC documentation, eg. its purpose, what problem it solves, what it enforces, how to use it.
  - Mention any used design patterns by NAME, eg. "This interface is used to enforce the Factory design pattern".

### TSDoc Documentation

- **Minimal**: Assume the reader knows node/js/ts fairly well. Avoid unnecessary verbosity. Avoid @param, @returns tags by default unless they describe something that is not obvious.
- **Assume IDE**: Assume that the docs are to be read inside an IDE, so do not describe things that are obviously apparent from the code or that can be inferred from the type system (like params) or more easily seen with common IDE features (like references to other files.).
- **`@examples`**: Assume reader is a skilled programmer. Omit examples if usage is obvious. May be pseudo code. Intended for understanding, eg. a function interface in 1-2 seconds. More elaborate examples are welcome, but should be in the test file, see [Testing Patterns](#testing-patterns).

## Testing Patterns

```typescript
import { describe, expect, it } from 'vitest'
import { assert } from 'node:assert' // use node-native assert for example code
import { functionToTest } from './functionToTest'

describe(
  // when renaming functions in IDE, this will automatically update to the new name
  functionToTest.name,
  () => {
    // tests are also documentation. Instead of long TSDOC comments with examples. Test suites may have an 'examples' 'it' block with examples. This way examples are sure to be updated when code is changed,
    it('examples', () => {
      // do not use 'expect' inside actual example code. Use node-native 'assert' and just expect the entire example to not throw on assertions.
      expect(() => {
        // example usage
        const one = 1
        // ...

        // simple assertions
        assert.deepStrictEqual(one, 1, 'one' /* short reference, not description */)
        //...
      }).not.toThrow()
    })

    describe('Some meaningful categorization two...', () => {
      it('should ...', () => {})
      it('should ...', () => {})
      it('should handle edge case one', () => {})
      it('should handle edge case two', () => {})
    })

    describe('Some meaningful categorization one...', () => {
      // ...
    })
  },
)
```

Class tests should follow same guides as function tests, and additionally:

```typescript
describe(ClassToTest.name, () => {
  describe('constructor', () => {})

  // Use prototype to get method names dynamically
  describe(ClassToTest.prototype.methodName, () => {})
  describe(ClassToTest.prototype.methodTwo, () => {})
})
```

## Key Libraries & Dependencies

### Commonly Used Libraries

- **lodash**: Utility functions (prefer individual imports)
- **iter-tools**: Functional iteration utilities
- **type-fest**: Advanced TypeScript utilities
- **upath**: Cross-platform path handling
- **fs-extra**: Terminal color output
- **ansi-colors**: Terminal color output

## Error Handling & Debugging

### Error Patterns

```typescript
// Descriptive error messages with context
if (!isValidInput(input)) {
  throw new Error(`Invalid input provided: expected X but got ${typeof input}`)
}

// Use type guards for runtime validation
export function isValidType(value: unknown): value is ValidType {
  return typeof value === 'object' && value !== null && 'property' in value
}
```

### Debugging Support

- Custom `[inspect.custom]` methods for complex objects
- `toJSON()` methods for serialization
- Profiler utilities for performance analysis
- Stack trace enhancement utilities
