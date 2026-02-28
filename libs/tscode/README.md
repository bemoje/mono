# @mono/tscode

TypeScript code processing utilities and AST helpers for imports, formatting, and linting.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Usage

### Import Parsing & Manipulation

```ts
import {
  parseImportStatement,
  importStatementGetKeywords,
  importStatementHasTypeKeyword,
  importStatementStripKeywords,
  tsExtractImports,
  tsStripImports,
  tsSortImports,
} from '@mono/tscode'

const importStr = "import type { A, B } from 'module'"

// Parse into structured data
const parsed = parseImportStatement(importStr)

// Check properties
importStatementHasTypeKeyword(importStr)
// => true

// Get named imports/exports keywords
importStatementGetKeywords(importStr)
// => ['A', 'B']

// Remove properties
importStatementStripKeywords(importStr, ['B'])
// => "import type { A } from 'module'"

// Find all import statements in a file
const sourceCode = `
import { X } from 'x'
const y = 1;
`
tsExtractImports(sourceCode)
// => ["import { X } from 'x'"]

// Strip imports from source code
tsStripImports(sourceCode)
// => "\nconst y = 1;\n"

// Sort imports in source code alphabetically
tsSortImports(sourceCode)
```

### Import Formatting

```ts
import { importStatementToOneLiner, importStatementToFormattedOneLiner } from '@mono/tscode'

const multiLine = `import {
  A,
  B
} from 'm'`

importStatementToOneLiner(multiLine)
// => "import { A, B } from 'm'"

importStatementToFormattedOneLiner(multiLine)
// => "import { A, B } from 'm'"
```

### Formatting Utilities

```ts
import { tsCrlfToLf, tsLintFilepath } from '@mono/tscode'

// Normalize line endings
tsCrlfToLf('line1\r\nline2')
// => 'line1\nline2'

// Applies basic fixes to a filepath specific to ts files if applicable
tsLintFilepath('path/to/file.tsx')
```

## API Reference

### Imports

| Function                             | Description                                           |
| ------------------------------------ | ----------------------------------------------------- |
| `parseImportStatement`               | Parse an import statement into structured data        |
| `importStatementGetKeywords`         | Extract all imported specifier keywords               |
| `importStatementHasTypeKeyword`      | Check if an import is a `type` import                 |
| `importStatementStripKeywords`       | Remove specific keywords from an import statement     |
| `importStatementToOneLiner`          | Convert a multiline import into a single line         |
| `importStatementToFormattedOneLiner` | Format a single-line import string                    |
| `tsExtractImports`                   | Extract all import statements from string code        |
| `tsStripImports`                     | Remove all import statements from string code         |
| `tsSortImports`                      | Sort import statements in a TypesScript source string |

### General Typescript Processing

| Function         | Description                                  |
| ---------------- | -------------------------------------------- |
| `tsCrlfToLf`     | Normalizes line endings to LF                |
| `tsLintFilepath` | Standardizes/lints a typical TS project path |
