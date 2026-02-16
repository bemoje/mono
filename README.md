# mono

Private for-fun-only mono-repo with TypeScript utility libraries used by other private projects.

This mono-repo also uses various custom repo management CLI tools, scripts and automated tasks.

### Status

**Libs Test Coverage**

| Metric    | Total | Covered | Percentage |
| --------- | ----- | ------- | ---------- |
| Lines     | 6989  | 6989    | 100%       |
| Functions | 800   | 800     | 100%       |
| Branches  | 2487  | 2487    | 100%       |

**Lines of Code**

| file type | files | lines of code |
| --------- | ----- | ------------- |
| source    | 562   | 9699          |
| test      | 445   | 27956         |
| examples  | 2     | 51            |
| total     | 1009  | 37706         |

## Table of Contents

- [mono](#mono)
  - [Status](#status)
  - [Table of Contents](#table-of-contents)
  - [Scripts](#scripts)
    - [`package.json`](#packagejson)
    - [`devkit` CLI](#devkit-cli)
  - [Workspaces](#workspaces)
    - [Documentation](#documentation)
      - [TSDoc](#tsdoc)
  - [External Dependencies](#external-dependencies)
    - [Strict Version Sync](#strict-version-sync)
    - [Introducing New Dependencies](#introducing-new-dependencies)
    - [Configuration](#configuration)
    - [libs](#libs)
      - [Directory Structure](#directory-structure)
  - [Testing](#testing)
    - [Test Coverage](#test-coverage)
  - [Semantic Extname Prefix System](#semantic-extname-prefix-system)
    - [Supported Prefixes](#supported-prefixes)
    - [Usage](#usage)
    - [Tool Integration](#tool-integration)
  - [Style Guide](#style-guide)
    - [Type Definitions](#type-definitions)
      - [Import/Export Patterns](#importexport-patterns)
    - [Test Patterns](#test-patterns)
  - [Debugging Support](#debugging-support)
  - [Exported Modules](#exported-modules)

## Scripts

### `package.json`

Scripts are defined in the root [`package.json`](/package.json). Each script property has a description via a custom JSON schema ([`docs/package.schema.json`](/docs/package.schema.json)), which is shown when hovering over a script name in VS Code.

### `devkit` CLI

The [`devkit`](/apps/devkit) CLI provides development utilities for the monorepo. It is the single consolidated tool for all repo management tasks including builds, code cleanup, insight/analysis, documentation generation, and more.

Run with `yarn dk` (build + run) or `yarn DK` (run without building). The built artifact (`.dist/devkit.cjs`) is committed to git for zero-dependency bootstrapping.

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

- **es-toolkit**: A state-of-the-art, high-performance JavaScript utility library with a small bundle size and strong type annotations.
- **iter-tools**: The iterable toolbox
- **type-fest**: A collection of essential TypeScript types
- **upath**: A proxy to `path`, replacing `\` with `/` for all results (supports UNC paths) & new methods to normalize & join keeping leading `./` and add, change, default, trim file extensions.
- **fs-extra**: fs-extra contains methods that aren't included in the vanilla Node.js fs package. Such as recursive mkdir, copy, and remove.
- **ansi-colors**: Easily add ANSI colors to your text and symbols in the terminal. A faster drop-in replacement for chalk, kleur and turbocolor (without the dependencies and rendering bugs).

### Configuration

- **Package Manager**: Use `yarn`
- **Workspaces**: `apps/*`, `packages/*`, `libs/*` (Yarn 4.3.1 workspaces)
- **Build System**: ESBuild with consistent configuration across packages
- **Module System**: ESNext modules, target Node 21+
- **Package Manager**: Yarn v4 with strict workspace management

### libs

Workspaces in the `libs/` directory may have additional directories/files but the directories and files shown below are those that are required in every workspace.

#### Directory Structure

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
    ├── **/*.test.ts      # Test files (Vitest)
    └── **/*.test.ts      # Test files (Vitest)
```

## Testing

The 'vitest' test framework is used for unit tests.
To run specific test(s), use `yarn test <GLOB_PATTERN>`

### Test Coverage

To generate coverage reports, see [scripts](#scripts).

Coverage data files are output to the [`.coverage/`](/.coverage) director.

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

## Exported Modules

**array**

- `arrAverage`: Calculates the average of an array of numbers.
- `arrEachToString`: Coerce each element of an array to string.
- `arrFindIndicesOf`: Returns an array of indices where the predicate function returns true for the corresponding element in the input array.
- `arrGetOrDefault`: Get array element at index or create it using factory function if it doesn't exist.
- `arrHasDuplicates`: Checks if an array has any duplicate elements.
- `arrIndicesOf`: Returns all indexes at which an element is found.
- `arrLast`: Returns the last element of an array. Throws an error if the array is empty.
- `arrMapMutable`: This function takes an array and a callback function as arguments. It applies the callback function to each element of the array, mutating the original array in the process.
- `arrObjectsToTable`: Convert an array of objects to a two-dimensional table.
- `arrObjectsUniqueKeys`: Returns an array of all unique object keys found in an array of objects.
- `arrRemove`: Remove a given element from a copy of a given array and return the resulting array.
- `arrRemoveDuplicates`: Remove duplicates from an array
- `arrRemoveMutable`: Remove elements in-place from an array.
- `arrShuffle`: Shuffle items in an array in-place. Guarantees changes.
- `arrSortNumeric`: Sorts an array of numbers, bigints, or booleans in ascending order.
- `arrSortedInsertionIndex`: Returns an index in the sorted array where the specified value could be inserted while maintaining the sorted order of the array. If the element is already in the array, returns the index after the last instance of the element.
- `arrSum`: Calculates the sum of an array of numbers.
- `arrSwap`: Swaps two elements in an array. This function takes an input array and swaps the elements at the specified indices.
- `arrTableAssertRowsSameLength`: Asserts that all rows in a 2D array have the same length.
- `arrTableEachToString`: Coerce each value of a 2D array table to string.
- `arrTableIterateAsObjects`: Generator that iterates through a 2D array table, yielding objects with header keys and row values.
- `arrTableRemoveColumns`: Removes specified columns from a 2D array table.
- `arrTableToCsv`: Converts a 2D array to a CSV string.
- `arrTableToObjects`: Converts a 2D array representing a table into an array of objects.
- `arrayToString`: Short and condensed string representation of an array, easy to read for error outputs or similar.

**cli**

- `Argument`: Defines a command-line argument
- `Command`: A type-safe CLI composer that can parse argv and generate help without execution coupling.
- `Help`: This is a fork of the Help class from the 'commander' npm package. The Help class method names as well as the expected interface of the Command instance to parse, are both similar, but different and not compatible without custom adaptations,
- `Option`: Represents a command-line option with support for short/long flags and various configurations.
- `assertNoMultipleVariadicArguments`: Ensures only one variadic argument per command
- `assertNoOptionalOrVariadicArguments`: Validates CLI argument ordering
- `assertNoVariadicArgument`: Validates optional args don't follow variadic args
- `assertOptionLongNotInUse`: Validates option long name are unique across command hierarchy
- `assertOptionNameNotInUse`: Validates option names are unique across command hierarchy
- `assertOptionShortNameIsValid`: Validates option short names are single alphanumeric characters
- `assertOptionShortNameNotInUse`: Validates option short names are unique across command hierarchy
- `findOption`: Finds option by name, short name or long name
- `findSubcommand`: Finds subcommand by name or alias
- `getCommandAncestors`: Returns all ancestor commands excluding this command
- `getCommandAndAncestors`: Returns command and all ancestor commands in hierarchy
- `parseOptionFlags`: Parses option flags string into its components

**composition**

- `Inspector`: Interface that target objects must implement to be inspectable. Provides standard inspection methods for debugging and serialization.
- `ParentRelationTypes`: Manages parent-child relationships between constructor types, tracking hierarchical connections and providing debugging capabilities.
- `Parenting`: Class that handles the parent-child relationships between objects on their behalf. In order to avoid circular references, all children keep a weak reference to their parent. However, it is not guaranteed. Two objects could in principle mutually be both each other's parent and child at the same time which would allow circular references to exist.
- `View`: Base class providing view functionality over a target object using the Composition pattern.
- `ignoreValuesDefaults`: Default options for ignoring specific values during object inspection.
- `ignoreValuesFilterDefaults`: Default filter functions for ignoring values during object inspection.
- `inheritProxifiedPrototype`: Inherits prototype properties from a target class to a viewer class with proxification, excluding specified keys.
- `inheritProxifiedPrototypeProperty`: Inherits a single prototype property from a target class to a viewer class with proxification.
- `inspectDefaults`: Default options for Node.js util.inspect with enhanced settings for better debugging output.
- `inspectorDefaults`: The default inspector configuration options.

**config**

- `ConfigFile`: Configuration file manager that provides schema validation and file I/O using the Strategy pattern.
- `JsonFileStrategy`: Strategy for loading and saving configuration data as JSON files.
- `SchemaConfigStrategy`: Strategy for validating configuration data against a TypeBox schema and applying default values.

**crypto**

- `decrypt`: Decrypts a string that was encrypted using encrypt(). Expects input in format: hexadecimal IV (32 chars) + encrypted data Uses PBKDF2 for key derivation with 100k iterations.
- `encrypt`: Encrypts a string using AES-256-CBC with a random IV. Uses PBKDF2 for key derivation with 100k iterations.

**date**

- `Timer`: Returns a function that returns the elapsed time since invokation.
- `dateString`: Reutnrs the date formatted as: yyyy-MM-dd
- `daysToMs`: Converts days to milliseconds.
- `getWeek`: Get the week number of the year for a given date using Danish locale.
- `hasCooldownElapsed`: Determines if a specified cooldown period has elapsed since a given date.
- `hoursToMs`: Converts hours to milliseconds.
- `minutesToMs`: Converts minutes to milliseconds.
- `monthNameDa`: Returns the name, in Danish language, of the month corresponding to the provided month number.
- `monthNameDaRelative`: Get the (Danish) name of the month relative to the current month.
- `msSinceDate`: Calculates the number of milliseconds that have elapsed since the given date.
- `secondsToMs`: Converts seconds to milliseconds.
- `stripTime`: Remove the time component from a date, returning only the date part.
- `today`: Get the UTC date today, time stripped
- `yesterday`: Get the UTC date yesterday, time stripped

**decorators**

- `lazyProp`: Decorator to memoize a method or getter accessor property.
- `memoizeAsync`: Decorator to memoize an async method. Uses memoizee library, so if params are objects, the decorator needs a normalizer function.
- `memoizeSync`: Decorator to memoize a sync method.

**fn**

- `bindArg`: Binds a specified argument to the provided function, returning a new function that requires only the remaining arguments at call time.
- `bindArgs`: Binds specified arguments to the provided function, returning a new function that requires only the remaining arguments at call time.
- `dethisify`: Converts a function from a class method by by making the first argument take the place of the 'this' context. The reverse of
- `functionSpy`: Wraps a function so that the given
- `maxConcurrency`: Creates a throttled version of an async function that limits the rate at which the function can be called.
- `preserveNameAndLength`: Preserves the name and length of a function or class constructor
- `sequence`: Creates a function that executes the provided async functions sequentially in order.
- `setLength`: Set the length of a function.
- `setName`: Set the name of a function.
- `thisProxy`: Returns a function that redirects or 'proxies' the 'this' context of the input function to a property of a given key.
- `thisify`: Converts a function to a class method by making the 'this' context the first argument.
- `transformReturnValue`: Wraps a function to transform its return value using a transform function.
- `wrapMethods`: Wrap methods, getters and setters of an object with custom logic.

**fs**

- `deleteOlderThan`: Delete files older than a given timestamp
- `getFileAge`: Retrieves the age of a file in milliseconds.
- `getFirstFileInDir`: Get the name of the first file (not directory) found in a directory.
- `readFileFirstLine`: Reads the first line of a file asynchronously.
- `removeDataUrlSchemePrefix`: Removes the data URL scheme prefix from a given string.
- `updateFile`: Updates a file by reading its content, applying a transformation function, and writing back the result. Creates the file and directories if they don't exist.
- `updateFileLines`: Updates a file by applying a transformation function to an array of lines. The transformation can return either a string (the entire new content) or an array of lines. Creates the file and directories if they don't exist.
- `updateFileLinesSync`: Synchronous version of `updateFileLines`.
- `updateFileSync`: Synchronous version of `updateFile`.
- `updateJsonFile`: Updates a JSON file by applying a transformation function to the parsed content. If the file doesn't exist or can't be parsed, uses the default value. Creates the file and directories if they don't exist.
- `updateJsonFileSync`: Synchronous version of `updateJsonFile`.
- `walkDirectory`: Walk a directory recursively and return an array of paths.

**is**

- `IsArrayWhereEach`: Creates a validator function that checks whether the input is an array where all elements are valid according to every validator provided.
- `IsFileExt`: Creates a validator function that checks if a string has the specified file extension (case-insensitive).
- `IsLength`: Creates a function that validates if the length of the input is equal to the specified length. The returned function accepts any value with a 'length' property and is named 'isLen' concatenated with the specified length.
- `createGtValidator`: Creates a validator function that checks if a value is a number greater than the specified limit.
- `createGteValidator`: Creates a validator function that checks if a value is a number greater than or equal to the specified limit.
- `createLtValidator`: Creates a validator function that checks if a value is a number less than the specified limit.
- `createLteValidator`: Creates a validator function that checks if a value is a number less than or equal to the specified limit.
- `ensureThat`: Ensures a value meets validation criteria, throwing an error if it doesn't.
- `ensureThatDefined`: Same as ensureThat except that if the value is undefined, it is considered valid.
- `isArray`: Checks if the provided value is an array.
- `isChar`: Determines whether a string is a single character.
- `isClass`: Checks if the given value is a constructor function using 'class' syntax. WARNING: If the running code is minified or mangled, this function may not work as expected. However, it should be resistant to minification/mangling if the 'class' keyword is present in the first line of the function.
- `isConstructor`: Checks if the given value is a valid constructor function.
- `isDefined`: This function checks if a value is defined or not. It performs a strict comparison against `undefined`.
- `isDefinedValue`: Checks if the provided value is defined (i.e., not `undefined` or `null`).
- `isDigit`: Returns true if the given character is a digit between 0 and 9.
- `isDigits`: Returns true if the given string is a string of digits between 0 and 9.
- `isEven`: Checks if a number is even.
- `isHex`: Checks if a string is a hexadecimal number. Understands prefixes for hex colors, hex decimal and regexp unicode hex.
- `isHexOrUnicode`: Checks if a given string is a hexadecimal or unicode.
- `isIntRange`: Determine whether the input is an array of two integers in ascending order.
- `isInteger`: Checks if the provided number is an integer.
- `isLen2`: Determine whether the input has length of 2.
- `isNamedFunction`: Checks if the provided value is a named function.
- `isNamedFunctionArray`: Checks if the provided value is an array containing only named functions.
- `isNegativeInteger`: Checks if a given number is a negative integer.
- `isNegativeNumber`: Checks if a given number is negative or zero.
- `isNonZeroNegativeInteger`: Checks if a given number is a negative non-zero integer.
- `isNonZeroNegativeNumber`: Checks if a given value is a negative number less than zero.
- `isNonZeroPositiveInteger`: Checks if a given number is a positive non-zero integer.
- `isNonZeroPositiveNumber`: Checks if a given value is a positive number greater than zero.
- `isNull`: Checks if the provided value is null.
- `isNumArrayAscending`: Determine whether the input is an array of numbers in ascending order. Duplicate values are allowed.
- `isNumericString`: Checks if a given string is numeric.
- `isObject`: Checks if the provided value is an object (null, arrays and functions not included).
- `isObjectType`: Checks if the provided value is an object type (null and functions included, array not included).
- `isOdd`: Checks if a number is odd.
- `isPosIntArray`: Determine whether the input is a positive (including zero) integer array.
- `isPosIntRange`: Checks if the input is an array of exactly two positive integers in ascending order, representing a valid range.
- `isPositiveInteger`: Checks if a given number is a positive integer.
- `isPositiveNumber`: Checks if a given value is a positive number (including zero).
- `isPrimitive`: Checks if the provided value is a primitive type (null, undefined, bigint, boolean, number, string or symbol).
- `isPrototype`: Checks if the given value is a prototype object
- `isStringArray`: Determine whether the input is a string array.
- `isStringWithNoSpacesOrDashes`: Checks if the provided value is a string that contains no spaces or dashes.
- `isUniqueNumArrayAscending`: Determine whether the input is an array of numbers in ascending order. Duplicate values are not allowed.
- `isValidNumber`: Checks if the provided value is a valid finite number (not NaN or Infinity).

**iter**

- `filterIterable`: Filter map entries based on a predicate function.
- `forEachIterable`: Execute a callback function for each entry in a map-like iterable.
- `mapIterable`: Transform both keys and values of map entries.
- `mapIterableKeys`: Transform map keys while preserving values.
- `mapIterableValues`: Transform map values while preserving keys.
- `reduceIterable`: Reduce a map-like iterable to a single value.
- `toObjectIterable`: Convert a map-like iterable to a regular object.

**map**

- `ExtMap`: Minimal Extended Map class focused only on Map-specific utilities.
- `TimeoutWeakMap`: A WeakMap with automatic timeout-based expiry for entries. Entries are automatically removed after a specified timeout period. Accessing an entry refreshes its timeout, extending its lifetime. This is useful for caching scenarios where you want automatic cleanup of unused entries while keeping frequently accessed ones alive.
- `entriesArray`: Returns an array of all key-value pairs in the map. Convenience method that converts the entries iterator to an array.
- `isGenericMap`: Checks if the provided value implements the Map interface with the specified required properties.
- `keysArray`: Returns an array of all keys in the map. Convenience method that converts the keys iterator to an array.
- `mapGetOrDefault`: Gets a value from a map or creates it using a factory function if it doesn't exist.
- `mapLoad`: Loads multiple entries into the map from an iterable.
- `mapReverse`: Reverses the order of entries in a Map.
- `mapUpdate`: Updates a value in the map using an update function.
- `sort`: Sorts the map entries using a custom comparison function and updates the map in place. This is Map-specific because it maintains insertion order.
- `sortByKeys`: Sorts the map entries by their keys and updates the map in place.
- `sortByValues`: Sorts the map entries by their values and updates the map in place.
- `toMap`: Converts a GenericMap to a native Map.
- `valuesArray`: Returns an array of all values in the map. Convenience method that converts the values iterator to an array.

**monorepo**

- `AbstractBase`: Abstract base class that provides common functionality for monorepo management including parenting and inspection capabilities.
- `AbstractCode`: Abstract base class for representing code structures in the monorepo with inspection and preview capabilities.
- `CodeBlock`: Represents a block of code within a larger code structure, defined by an index range.
- `File`: Represents a file in a workspace with various utility methods to check file types and read contents.
- `ImportKeywords`: Represents the imported keywords/specifiers in an import statement.
- `ImportSpecifiers`: Represents and analyzes import specifiers in TypeScript/JavaScript code. This class parses and categorizes different types of import statements such as default imports, named imports, namespace imports, mixed imports, and side effect imports. It provides methods to retrieve specific parts of import statements and to manipulate them.
- `ImportStatement`: Represents an import statement in TypeScript code with parsing and manipulation capabilities.
- `ModuleSpecifier`: Represents a module specifier in an import statement. Module specifiers are the strings that indicate where to import from, such as './path/to/file', '
- `MonoRepo`: Represents a monorepo with workspace management, TypeScript configuration, and dependency analysis capabilities.
- `SemanticExtnamePrefix`: Constants for semantic filename prefixes used to categorize files by their purpose.
- `SemanticExtnamePrefixDescriptions`: A record mapping semantic extname prefixes to their descriptions. - `d`: Declaration files - `test`: Vitest test suite files - `examples`: Files containing working and tested example usage code (included in git, but ignored by most repo tools) - `benchmark`: Benchmark files (included in git, but ignored by most repo tools) - `temp`: Temporary files (ignored by git, build, tests, etc.) - `wip`: Work in progress files (ignored by git, build, tests, etc.)
- `TestFile`: Represents a test file in the monorepo with TypeScript code analysis capabilities.
- `TsCode`: Represents TypeScript code with import parsing and manipulation capabilities.
- `TsFile`: Represents a TypeScript file in the monorepo with code analysis and dependency tracking capabilities.
- `Workspace`: Represents a workspace within a monorepo, providing functionality to analyze and manage workspace dependencies. A workspace is a directory containing a package.json file and typically source code files. This class provides methods and properties for analyzing: - Source and test files in the workspace - Dependencies declared in package.json - Dependencies imported in source and test files - Missing, unused, and incorrectly imported dependencies
- `getAllImports`: Retrieves all import statements from TypeScript source files across all workspaces in the monorepo.
- `getRepoRootDirpath`: Get the root directory path of the monorepo by finding the package.json with workspaces configuration.
- `getWorkspaceDirpaths`: Get all workspace directory paths by reading the workspace patterns from the root package.json.
- `hasExtnamePrefix`: Checks if a file path has any of the specified semantic extension prefixes (e.g., .test.ts).
- `resolveModuleImportPath`: Returns the resolved import path (relative from repo root)
- `semverVersionBump`: Bumps the semantic versioning (SemVer) of a given version string or array based on the specified level. The function supports 'major', 'minor', and 'patch' levels.

**node**

- `StringStream`: Extension of Node's native Readable class for converting a string into a Readable stream.
- `argvHasHelpFlag`: Checks if the command line arguments contain a help flag (--help or -h).
- `execInherit`: Executes a command synchronously with inherited stdio, returning a promise with the output.
- `execOutput`: Helper function to execute a shell command and return stdout and stderr without throwing on error. If there was an error and nothing was sent to stderr, the error.message takes its place.
- `execute`: Execute one or multiple shell commands.
- `formatTableForTerminal`: Formats a 2D array of strings as a terminal table with optional headers and styling.
- `getCurrentMemoryUsage`: Get the current heap memory usage in megabytes.
- `isTerminalColorSupported`: Check if colored terminal output is (probably) supported.
- `memoryUsage`: Returns the memory usage of the Node.js process with values converted from bytes to megabytes and rounded to the specified precision.
- `prompt`: Prompt the user for input.
- `shellSpawnProgram`: Spawns a program using child_process.spawn with promise-based interface and optional stdio inheritance control.
- `spawnChildProcess`: Spawn a child process.
- `spawnNodeProcess`: Spawn a child node process.
- `startPowerShellScript`: Executes a PowerShell script with arguments and returns stdout/stderr.
- `streamToString`: Drain a Readable into a string.
- `timer`: Executes a task and logs the execution time with the specified name.
- `toError`: Converts the given value to an Error object. If the value is already an Error object, it is returned as is. If the value is not an Error object, it is converted to a string and used as the error message.

**number**

- `NumberFormatter`: A utility class for formatting and parsing numbers with locale-specific separators. This class allows for customizing thousand and decimal separators, setting precision for decimal places, and supports different locales for international number formatting.
- `bytesToKilobytes`: Converts a given number of bytes into kilobytes.
- `bytesToMegabytes`: Converts a given number of bytes into megabytes.
- `determineNumberLocale`: Determine whether a set of valid number strings are formatted in da-DK or en-US locale.
- `numRange`: Generates an array of numbers within a specified range.
- `randomIntBetween`: Returns a random integer between min (inclusive) and max (inclusive).
- `round`: Round a given number with a given precision. Shifts with exponential notation to avoid floating-point issues.
- `roundDown`: Round a given number down with a given precision. Shifts with exponential notation to avoid floating-point issues.
- `roundToNearest`: Round a given number to a given nearest whole number.
- `roundUp`: Round a given number up with a given precision. Shifts with exponential notation to avoid floating-point issues.
- `roundWith`: Round a given number with a given precision and rounding function. Shifts with exponential notation to avoid floating-point issues.

**object**

- `OptionsConfigurator`: A utility function to configure options based on a given schema or properties. This function provides a builder pattern to define and validate options, including handling default values, required keys, and optional keys.
- `arrAssign`: Array assignment function that merges arrays excluding null and undefined values.
- `className`: Get the class name of an object from its constructor.
- `classPrototype`: Get the class prototype object relating to an object or class.
- `constructorOf`: Returns the constructor of the given object.
- `createArrayMerger`: Creates a function that merges arrays based on a predicate function.
- `createObjectMerger`: Creates a function that merges objects based on a predicate function.
- `defineAccessors`: Define accessor properties (getter and setter) on an object with enhanced descriptor handling.
- `defineGetter`: Define a getter property on an object with enhanced descriptor handling.
- `defineLazyProperty`: Define a lazy property that evaluates its getter on first access and then caches the value.
- `defineMethod`: Define a method property on an object with enhanced descriptor handling.
- `defineProperty`: Utility function for defining properties on objects with enhanced descriptor handling.
- `defineSetter`: Define a setter property on an object with enhanced descriptor handling.
- `defineValue`: Define a value property on an object with enhanced descriptor handling.
- `deleteNullishPropsMutable`: Mutably delete enumerable properties with null or undefined values.
- `entriesOf`: Same as Object.entries except the keys are typed as keyof T.
- `filterObject`: Filter an object's own enumerable properties by predicate.
- `filterObjectMutable`: Mutably filter an object's own properties based on a given predicate.
- `getClassChain`: Get the class constructor chain for any target (constructor, prototype, or instance). Always returns constructors/classes, never prototype objects. By default excludes the target's own constructor (returns superclasses only).
- `getConfigurableMethodOrGetterKeys`: Returns an array of keys representing configurable methods or getters of an object.
- `getKeys`: Returns an array of the own property keys of an object. Every combination of ways to toggle enumerable/non-enumerable/strings/symbols are available. Ignoring specific keys is also possible.
- `getKeysPreset`: Creates a preset function for getting object keys with specific filtering options.
- `getOwnProperty`: Returns a given own property value of a given object.
- `getPrototypeChain`: Get the prototype chain of any object. Returns prototype objects, not constructors.
- `getSuperClass`: Get the immediate superclass of a target. Returns Object if no meaningful superclass exists.
- `getSuperClasses`: Get all superclasses of a target (excluding the target itself by default). Simpler version without overloads - just returns the class chain.
- `hasOwnProperty`: Object.prototype.hasOwnProperty.call
- `hasProperty`: Determines if a property is defined on an object, including 'own' and prototype chain.
- `hasPrototypeChainProperty`: Determines if a property is defined on an object's prototype prototype chain, not including the object itself.
- `inheritPrototypeMembers`: Copies prototype members from a source constructor to a target constructor, excluding specified keys.
- `inheritStaticMembers`: Copies static members from a source constructor to a target constructor, excluding specified keys.
- `isAccessorDescriptor`: Check if the given descriptor is an accessor descriptor.
- `isEnumerable`: Check if the property is enumerable.
- `isMethodValueDescriptor`: Checks if a property descriptor represents a method (function value descriptor).
- `isValueDescriptor`: Check if the given descriptor is a value descriptor.
- `iterableFirstElement`: Returns the first element of an iterable object.
- `iterateObject`: Generator that performs a depth-first traversal of an object's structure. Yields information about each node including its path, value, and container type. Handles circular references and maintains parent-child relationships. Key features: - Supports both objects and arrays - Generates Lodash-style property paths - Detects leaf nodes (primitives) - Prevents circular reference loops - Preserves traversal order
- `keysOf`: Same as Object.keys except the keys are typed as string keys of T.
- `mapObject`: Maps over an object's values, transforming each value using the provided function.
- `mapObjectEntries`: Maps over an object's entries, transforming both keys and values using the provided function.
- `mapObjectKeys`: Maps over an object's keys, transforming each key using the provided function while preserving values.
- `objAssign`: Like Object.assign, but only copies source object property values != null.
- `objDeepFreeze`: Deep freezes an object. Note: Deep recursion may cause stack overflow for very deeply nested objects.
- `objDefineLazyProperty`: Defines a lazy property on an object. The property will be lazily evaluated on the first access and then cached for subsequent accesses. The property is both enumerable and configurable.
- `objDelete`: Deletes a property from an object and returns the modified object.
- `objForEach`: Applies a callback function to each key-value pair in an object.
- `objGet`: Retrieves the value associated with the specified key from an object.
- `objGetOrDefault`: Gets a property value from an object or creates it using a factory function if it doesn't exist.
- `objGetOrDefaultValue`: This function attempts to retrieve a value from an object using a provided key. If the key does not exist in the object, it sets the provided default value in the object and returns it.
- `objHas`: Checks if an object has a specific key.
- `objIsEmpty`: Checks if an object is empty.
- `objOmitKeysMutable`: Deletes the specified keys from an object in a mutable way.
- `objPropertyValueToGetter`: Converts the specified properties of an object into getter functions.
- `objReduce`: Reduces the values of an object into a single value.
- `objSet`: Sets a value for a key in an object and returns the value.
- `objSize`: Returns the number of enumerable keys in an object.
- `objSortKeys`: Sorts the keys of an object in alphabetical order unless a custom compare function is provided.
- `objToMap`: Converts an object to a Map.
- `objUpdate`: Updates the value of a specific key in an object using a callback function.
- `objUpdatePropertyDescriptors`: Updates the property descriptors of the specified properties on the given object.
- `propertyIsEnumerable`: Calls Object.prototype.propertyIsEnumerable on the given object.
- `setEnumerable`: Sets the enumerable property of the specified properties of an object to true.
- `setNonConfigurable`: Sets the specified properties of an object as non-configurable.
- `setNonEnumerable`: Sets the specified properties of an object as non-enumerable.
- `setNonWritable`: Sets the specified properties of an object to be non-writable.
- `setWritable`: Sets the specified properties of an object to be writable.
- `sortKeys`: Sort an object's keys.
- `sortKeysLike`: Sorts the keys of an object in the given order.
- `staticClassKeysOf`: Returns the static string-property keys of a class but without the natively built-in keys 'length', 'name', and 'prototype'.
- `valuesOf`: Get the values of an object with type-safe return value.

**os**

- `defaultOpenInEditorCommand`: Get the default command to open a file in in a text editor. If VSCode is installed, this is used. Otherwise, the default text editor of the OS is used.
- `getAppDataPath`: Get the app data path, depending on the current OS (win, osx, linux).
- `getDefaultBrowserWindows`: Gets the default browser identifier on Windows by querying the registry.
- `getHomeDirectory`: Returns the home directory of the current user.
- `getOS`: Determines the current operating system. It uses the isWindows, isOSX, and isLinux functions to determine the current operating system.
- `getTempDataPath`: Returns a path to the os tmpdir location.
- `getTempFilepath`: Returns a path to a temporary file with the given basename and subpath.
- `isLinux`: Checks if the current platform is Linux. It checks the 'process' object and the 'platform' property to determine if the platform is 'linux'.
- `isLinuxProgramInstalled`: LINUX ONLY: Returns whether a program is installed on the system. Always returns false of OS is not linux.
- `isOSX`: Checks if the current platform is OSX. It checks the 'process' object and the 'platform' property to determine if the platform is 'darwin'.
- `isVsCodeInstalled`: Returns whether Visual Studio Code is installed on the system.
- `isWindows`: Checks if the current platform is Windows.
- `openInDefaultBrowserCommand`: Gets the command to open a URL in the default browser for the current operating system.
- `winExplorerOpenDirectory`: Opens a directory in Windows Explorer. Works on Windows only.

**path**

- `cwd`: Join paths starting from process.cwd()
- `dirnameDeep`: Returns the absolute path of the parent directory of the given path.
- `hasBasename`: Checks if a file path has any of the specified basenames.
- `hasExtname`: Checks if a file path has any of the specified file extensions.
- `hasParentDirname`: Whether fspath is a subpath of a parent directory with the given name.
- `isRelative`: Whether a path is a relative string, ie. not absolute.
- `isUnc`: Determines if a given filepath is a UNC path.
- `isValidWin32`: Check whether a provided windows filesystem path string is valid according to: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx
- `prefixFilename`: Append string to the beginning of the filename.
- `root`: Returns the root directory of a given path.
- `suffixFilename`: Append string to the end of the filename.
- `toCwdRelative`: Solve the relative path from the process.cwd() path to the {p} path. At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
- `toWin32`: Ensures win32 backslashes are used instead of forward slashes.

**profiler**

- `Profiler`: A utility class for profiling functions, classes, and modules to measure execution time and other performance metrics.

**regex**

- `regexEscapeString`: Escapes special characters in a string to be used in a regular expression.
- `rexec`: Easily perform regex 'exec' on a string. An iterable is returned which steps through the exec process and yields all the details you might need.

**stacktrace**

- `enablePrettyStackTrace`: Enables pretty stack trace formatting for uncaught exceptions.
- `prettyStackTrace`: Formats stack traces with colors and improved readability for debugging.

**string**

- `camelCase`: Converts a string to camel case.
- `countFloatDecimals`: Counts the number of decimal places in a floating-point number.
- `endsWithIncompleteUtfPairSurrogate`: Returns true if the string ends with an incomplete UTF-16 surrogate pair. This is useful for determining if a string can be safely concatenated with another string.
- `strCountCharOccurances`: Counts the number of occurrences of a specific character in a string.
- `strCountChars`: Counts the number of occurrences of each character in a string and returns a Map where the keys are the characters and the values are their counts.
- `strEnsureEndsWith`: Ensures that a string ends with a specified substring. If the string already ends with the specified substring, it is returned as is. Otherwise, the substring is appended to the end of the string.
- `strEnsureStartsWith`: Ensures that a string starts with a specified substring. If the string already starts with the specified substring, it is returned as is. Otherwise, the substring is appended to the end of the string.
- `strFirstCharToLowerCase`: Converts the first character of a string to lowercase.
- `strFirstCharToUpperCase`: Converts the first character of a string to uppercase.
- `strHashToBuffer`: Hash a string into a buffer with a given algorithm
- `strHashToString`: Hash a string into a buffer with a given algorithm
- `strHashToStringDJB2`: Hashes a string using the DJB2 algorithm, returning a numeric hash value.
- `strHashToUint32Array`: Hash a string into an array of unsigned 32-bit integers.
- `strIsLowerCase`: Checks if the given string is in lower case.
- `strIsMultiLine`: Checks if a string contains multiple lines.
- `strIsUpperCase`: Checks if the given string is in upper case.
- `strMaxTwoConsecutiveEmptyLines`: Replaces all occurrences of more than two consecutive empty lines with two empty lines.
- `strNoConsecutiveEmptyLines`: Removes consecutive empty lines from a given string.
- `strNoConsecutiveWhitespace`: Removes consecutive whitespace characters in a string and replaces them with a single space.
- `strParseBoolean`: Parses a string into a boolean.
- `strPrefixCamelCased`: Prepend a camelCased string. Examples:
- `strPrependLines`: Prepend each line of a string with a specified string.
- `strRemoveDuplicateChars`: Removes duplicate characters from a string.
- `strRemoveEmptyLines`: Removes all empty lines from a given string.
- `strRemoveFirstAndLastLine`: Removes the first and last line from a given string.
- `strRemoveNewLines`: Removes all new line characters from a string.
- `strRepeat`: Repeats the given string `n` times.
- `strReplaceAll`: Replaces all occurrences of a substring in a string with a specified replacement.
- `strSortChars`: Sorts the characters in a string in alphabetical order.
- `strSplitAndTrim`: Splits a string by a specified delimiter and trims each resulting substring. Optionally, it can also remove empty lines.
- `strSplitCamelCase`: Returns an array of words in the string
- `strToCharCodes`: Converts a string to an array of character codes.
- `strToCharSet`: Converts a string to a set of unique characters.
- `strToGetterMethodName`: Prepend a camelCased string with 'get'.
- `strToSetterMethodName`: Prepend a camelCased string with 'set'.
- `strToSortedCharSet`: Converts a string to a sorted set of unique characters.
- `strTrimLines`: Trims leading and trailing whitespace from each line in a string.
- `strTrimLinesLeft`: Trims the leading whitespace from each line in a string.
- `strTrimLinesRight`: Trims trailing whitespace from each line in a string.
- `strUnwrap`: Removes the specified left and right substrings from the input string.
- `strWrapBetween`: Wraps a string between two other strings.
- `strWrapIn`: Wraps a given string with another string.
- `strWrapInAngleBrackets`: Wraps a string in angle brackets.
- `strWrapInBraces`: Wraps a given string in braces.
- `strWrapInBrackets`: Wraps a string in brackets.
- `strWrapInDoubleQuotes`: Wraps a given string in double quotes.
- `strWrapInParenthesis`: Wraps a given string in parenthesis.
- `strWrapInSingleQuotes`: Wraps a given string in single quotes.
- `stringLineCount`: Count the number of lines in a string.
- `titleCaseWord`: Returns first char upper, rest lower. Assumes the given string is a single word.
- `unwrapDoubleQuotes`: Remove double quote from the beginning and end of a string and trims whitespace at the beginning and end of the string

**table**

- `TableFormatter`: Formats a 2D array representing a table.
- `formatAsStringTable`: Formats an array of objects into a string table with customizable column formatters.
- `getHeadersFromCsvFile`: Extracts column headers from the first line of a CSV file.
- `iterateTableArrayAsObjects`: Generator that iterates through a 2D table array, yielding objects with header keys and row values.
- `objectsToTable`: Convert an array of objects to a table.
- `parseCsvHeaderLine`: Takes the first line of a CSV string and returns an array of column names.

**template**

- `JsonFileTemplateStrategy`: Template strategy for handling JSON file templates with structured object schemas. Converts structured objects to formatted JSON strings and parses JSON strings back to typed objects. Uses pretty-printing with 2-space indentation for human-readable output.
- `StringTemplateStrategy`: Template strategy for handling simple string templates. Provides pass-through behavior for string templates where the template and rendered output are both plain strings. Useful for text-based templates that don't require parsing or complex structure.
- `Template`: A generic template engine that supports variable substitution using the Strategy pattern. Validates templates and options against TypeBox schemas and renders templates with provided data. Supports mustache-style `{{variable}}` syntax for variable substitution.
- `TextFileTemplateStrategy`: Template strategy for handling multi-line text file templates. Converts arrays of strings to newline-separated text and parses text files back to string arrays by splitting on newlines. Ideal for processing configuration files, scripts, or any line-based text content.

**terminal**

- `clearTerminal`: Clears the terminal screen using the system's clear command.
- `confirmPrompt`: Prompts the user to confirm in the terminal.

**tschema**

- `SchemaValidationError`: Error thrown when a value does not match a given schema. Contains an array of ValueError instances with details about each violation.
- `assertValidSchema`: Asserts that data conforms to a TypeBox schema, throwing a SchemaValidationError if it doesn't.

**tscode**

- `importStatementGetKeywords`: Extracts keywords from an import statement line (e.g., 'type' from 'import type').
- `importStatementHasTypeKeyword`: Checks if an import statement line contains the 'type' keyword.
- `importStatementStripKeywords`: Removes the 'import' and 'type' keywords from an import statement line.
- `importStatementToFormattedOneLiner`: Converts a multi-line import statement to a formatted single line with proper spacing. Adds spaces around braces, keywords, and other import statement elements for readability.
- `importStatementToOneLiner`: Converts a multi-line import statement to a single line by removing comments and extra whitespace. This function strips comments, normalizes whitespace, and removes trailing commas to create a clean single-line import statement.
- `parseImportStatement`: Parses an import statement into its constituent parts for detailed analysis. This function breaks down an import statement into keywords, specifiers, module path, and other components, providing a comprehensive analysis of the import structure.
- `tsCrlfToLf`: Converts CRLF line endings to LF in TypeScript code. This function normalizes line endings from Windows-style (CRLF) to Unix-style (LF) for consistent processing across different operating systems.
- `tsExtractImports`: Extract all import statements from a given TypeScript source code string. This function parses TypeScript code to identify and extract all import statements, handling both single-line and multi-line imports. It correctly ignores import-like text within comments and string literals.
- `tsLintFilepath`: Runs ESLint with auto-fix on a TypeScript file, suppressing any errors. This function attempts to automatically fix linting issues in the specified file using ESLint's auto-fix capability. Any errors during execution are silently ignored.
- `tsSortImports`: Sorts import statements in TypeScript code alphabetically by module specifier. This function extracts all import statements, sorts them alphabetically by the module path, and reconstructs the code with sorted imports at the top.
- `tsStripImports`: Removes import statements from TypeScript code. This function extracts all import statements and removes them from the source code, leaving only the non-import content.
