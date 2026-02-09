# Find Missing Tests Script

## Overview

This script identifies source code files in the monorepo that are missing corresponding test files. It helps maintain test coverage by highlighting files that should have tests but don't.

## Usage

Run the script using the yarn command:

```bash
yarn insight:findMissingTests
```

Or directly:

```bash
node s/insight/findMissingTests.mjs
```

## How It Works

The script:

1. Scans all TypeScript files in `libs/*/src/**/*.ts` and `apps/*/src/**/*.ts`
2. Excludes files that are already test files (`*.test.ts`, `*.spec.ts`)
3. Checks if each source file has a corresponding `.test.ts` file in the same directory
4. Filters out files that shouldn't have tests:
   - `index.ts` files (barrel exports)
   - Type definition files starting with 'T' (e.g., `TCryptoAlgorithm.ts`)
   - `.d.ts` type definition files
   - Config files

## Current Results

As of the last run, the script found **152 source files** missing test files:

- **libs/types**: 58 files (mostly type utility files)
- **libs/monorepo**: 18 files
- **libs/cli**: 18 files
- **apps/devkit**: 15 files
- **apps/playground**: 11 files
- **libs/composition**: 9 files
- **libs/object**: 5 files
- **libs/profiler**: 4 files
- **libs/string**: 4 files
- **libs/decorators**: 2 files
- **libs/map**: 2 files
- **libs/config**: 2 files
- **libs/node**: 1 file
- **libs/os**: 1 file
- **libs/stacktrace**: 1 file
- **libs/tschema**: 1 file

## Output Format

The script provides:
- A summary count of files missing tests
- Files grouped by workspace
- A formatted table showing the file name and full path
- Total count at the end

## Integration

The script is integrated into the package.json scripts as:
- `insight:findMissingTests` - Run the analysis

It follows the same pattern as other insight scripts like `insight:linesOfCode` and `insight:checkLibsTsDoc`.

## Notes

- The script uses a heuristic to identify files that should have tests
- Type definition files and certain utility files are intentionally excluded
- Files in the `libs/types` package are mostly type utilities which typically don't require traditional unit tests
