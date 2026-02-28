# <!-- REPO_NAME -->

<!-- REPO_DESCRIPTION -->

This mono-repo also uses various custom repo management CLI tools, scripts and automated tasks.

### Status

**Libs Test Coverage**

<!-- LIBS_COVERAGE_SUMMARY_TABLE -->

**Lines of Code**

<!-- LINES_OF_CODE_TABLE -->

## Table of Contents

<!-- TOC_TABLE -->

## Apps

- [devkit](./apps/devkit/README.md) - Development utilities for the monorepo.
- [linkedin-resume](./apps/linkedin-resume/README.md) - A CLI tool to generate a LinkedIn resume in PDF format.
- [playground](./apps/playground/README.md) - Scratch/dev workspace for experimentation.

## Scripts

### `package.json`

Scripts are defined in the root [`package.json`](/package.json). Each script property has a description via a custom JSON schema ([`docs/package.schema.json`](/docs/package.schema.json)), which is shown when hovering over a script name in VS Code.

### `devkit` CLI

The [`devkit`](/apps/devkit) CLI provides development utilities for the monorepo. It is the single consolidated tool for all repo management tasks including builds, code cleanup, insight/analysis, documentation generation, and more.

Run with `yarn dk`.

## Workspaces

Workspaces are discovered from glob patterns defined in [(`package.json`).workspaces](/package.json):

### Documentation

#### TSDoc

- **Minimal**: Assume the reader knows node/js/ts fairly well. Avoid unnecessary verbosity. Avoid @param, @returns tags by default unless they describe something that is not obvious.
- **Assume IDE**: Assume that the docs are to be read inside an IDE, so do not describe things that are obviously apparent from the code or that can be inferred from the type system (like params) or more easily seen with common IDE features (like references to other files.).
- **`@examples`**: Assume reader is a skilled programmer. Omit examples if usage is obvious. May be pseudo code. Intended for understanding, eg. a function interface in 1-2 seconds. More elaborate examples are welcome, but should be in the test file, see [Testing Patterns](#testing-patterns).

## External Dependencies

In order to have as few dependencies as possible, this repo attempts to avoid having multiple dependencies that do the same thing.

### Strict Version Sync

All dependencies are added at monorepo root `package.json` and are versioned with the same version as the mono repo itself. This ensures that all workspaces use the same version of the dependencies.

### Introducing New Dependencies

Before introducing a new dependency, check if if one of the library packages already provides the functionality you need.

- **es-toolkit**: <!-- ES_TOOLKIT_INFO -->
- **iter-tools**: <!-- ITER_TOOLS_INFO -->
- **type-fest**: <!-- TYPE_FEST_INFO -->
- **upath**: <!-- UPATH_INFO -->
- **fs-extra**: <!-- FS_EXTRA_INFO -->
- **ansi-colors**: <!-- ANSI_COLORS_INFO -->

### Configuration

- **Package Manager**: Use `yarn`
- **Workspaces**: `libs/*`, `apps/*` (Yarn 4.3.1 workspaces)
- **Build System**: ESBuild with consistent configuration across packages
- **Module System**: ESNext modules

### libs

Workspaces in the `libs/` directory may have additional directories/files but the directories and files shown below are those that are required in every workspace.

#### Directory Structure

```
libs/<package-name>/
├── esbuild.mjs           # Build configuration (standardized)
├── eslint.config.mjs     # Extends root ESLint config
├── package.json          # Package metadata with build/lint scripts
├── README.md             # Package documentation
├── tsconfig.json         # Extends ../../tsconfig.json
└── src/
    ├── index.ts          # Barrel export file
    ├── **/*.ts           # Implementation files
    └── **/*.test.ts      # Test files (Vitest)
```

## Testing

The 'vitest' test framework is used for unit tests.
To run specific test(s), use `yarn test <GLOB_PATTERN>`

### Test Coverage

To generate coverage reports, see [scripts](#scripts).

Coverage data files are output to the [`.coverage/`](/.coverage) directory.

For full coverage reports, use `yarn test-coverage` which will run tests in all workspaces and generate a coverage report for each workspace in the `.coverage/` directory.

## Semantic Extname Prefix System

This monorepo uses semantic extension prefixes to categorize files by their purpose.
Files follow the pattern: `<filename>.<prefix>.<extension>`

### Supported Prefixes

| Prefix        | Description                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `.d.`         | declarations                                                                                    |
| `.test.`      | vitest test suite                                                                               |
| `.examples.`  | contains working and tested example usage code. Included in git, but ignored by most repo tools |
| `.benchmark.` | benchmark files, included in git, but ignored by most repo tools.                               |
| `.temp.`      | temporary files, ignored by git, build, tests, etc.                                             |
| `.wip.`       | work in progress, ignored by git, build, tests, etc.                                            |

### Usage

- **Testing**: Run with `yarn test <filepath>` or `yarn test <workspace>`
- **Build exclusion**: Files with semantic prefixes are automatically excluded from builds
- **Git handling**: `.temp.` and `.wip.` files are git-ignored
- **File classification**: The monorepo system uses these prefixes for automated file categorization

### Tool Integration

- **ESBuild**: Excludes test/spec/example files from production builds
- **Vitest**: Auto-discovers test/spec files for test execution
- **Git**: Ignores temp/wip files via .gitignore patterns
- **Index generation**: Excludes semantic prefix files from auto-generated index.ts files

## Style Guide

### Type Definitions

- **types**: Use `type` for simple type definitions and structs that describe the shape/structure of data.
- **interfaces**: Use `interface` for actual interfaces that are implemented by classes or similar and are important programmer instructions/contracts, usually to enforce a design pattern.
  - These must be public facing named exports and should have their own file.
  - These should have good TSDOC documentation, eg. its purpose, what problem it solves, what it enforces, how to use it.
  - Mention any used design patterns by NAME, eg. "This interface is used to enforce the Factory design pattern".

#### Import/Export Patterns

- **`src/`**: All source code files should be placed in the `src/` directory.
- **`src/*.ts`**: The `src/` dir should not have any subdirectories by default. If it does, it needs special handling in scripts/configs because index.ts files are auto-generated.
- **`src/index.ts`**: Most `src/index.ts` files are auto-generated barrel files that export every named export from every file in the package.
- **public API exports**: Use named export for anything public facing. No default exports.
- **public API files**: A file must at most have one named export which should match its filename and are public facing.
- **PascalCase naming exception**: Functions that are constructor-like (return other functions, often validators) should use PascalCase naming to indicate their constructor semantics, e.g., `IsLength()`, `IsFileExt()`.
- **internal files**: Helpers, utils and other internal objects should stay in the file they are used in and are not exported, unless:
  - If used in multiple files, move it to a new file, and (ONLY!) default export it.
  - If internal helpers need unit testing (should not be be the case as it indicated bad untestable design), either refactor to more testable design or otherwise move it to a new file, default export it and create test file matching that filename.

**Example `libs/` directory refactoring**

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

### Test Patterns

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

## Debugging Support

- Performance analysis utilities library in [libs/profiler](/libs/profiler)
- Stack trace enhancement utilities library in [libs/stacktrace](/libs/stacktrace)

## Libraries

<!-- LIBRARY_EXPORTED_MODULES -->
