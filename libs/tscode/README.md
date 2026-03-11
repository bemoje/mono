# @mono/tscode

TypeScript code processing utilities and AST helpers for imports, formatting, and linting.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**importStatementGetKeywords**](./src/importStatementGetKeywords.ts): Extracts keywords from an import statement line (e.g., 'type' from 'import type').
- [**importStatementHasTypeKeyword**](./src/importStatementHasTypeKeyword.ts): Checks if an import statement line contains the 'type' keyword.
- [**importStatementStripKeywords**](./src/importStatementStripKeywords.ts): Removes the 'import' and 'type' keywords from an import statement line.
- [**importStatementToFormattedOneLiner**](./src/importStatementToFormattedOneLiner.ts): Converts a multi-line import statement to a formatted single line with proper spacing. Adds spaces around braces, keywords, and other import statement elements for readability.
- [**importStatementToOneLiner**](./src/importStatementToOneLiner.ts): Converts a multi-line import statement to a single line by removing comments and extra whitespace. This function strips comments, normalizes whitespace, and removes trailing commas to create a clean single-line import statement.
- [**parseImportStatement**](./src/parseImportStatement.ts): Parses an import statement into its constituent parts for detailed analysis. This function breaks down an import statement into keywords, specifiers, module path, and other components, providing a comprehensive analysis of the import structure.
- [**tsCrlfToLf**](./src/tsCrlfToLf.ts): Converts CRLF line endings to LF in TypeScript code. This function normalizes line endings from Windows-style (CRLF) to Unix-style (LF) for consistent processing across different operating systems.
- [**tsExtractImports**](./src/tsExtractImports.ts): Extract all import statements from a given TypeScript source code string. This function parses TypeScript code to identify and extract all import statements, handling both single-line and multi-line imports. It correctly ignores import-like text within comments and string literals.
- [**tsLintFilepath**](./src/tsLintFilepath.ts): Runs ESLint with auto-fix on a TypeScript file, suppressing any errors. This function attempts to automatically fix linting issues in the specified file using ESLint's auto-fix capability. Any errors during execution are silently ignored.
- [**tsSortImports**](./src/tsSortImports.ts): Sorts import statements in TypeScript code alphabetically by module specifier. This function extracts all import statements, sorts them alphabetically by the module path, and reconstructs the code with sorted imports at the top.
- [**tsStripImports**](./src/tsStripImports.ts): Removes import statements from TypeScript code. This function extracts all import statements and removes them from the source code, leaving only the non-import content.

<!-- EXPORTS_END -->

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
