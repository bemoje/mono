# @bemoje/regex

Regular expression utilities for escaping special characters and performing detailed regex execution with match metadata.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/regex
```

## Usage

### Escape Special Characters

```ts
import { regexEscapeString } from '@bemoje/regex'

regexEscapeString('price: $10.00 (USD)') // 'price: \$10\.00 \(USD\)'

// Safe for dynamic regex construction
const userInput = 'file[1].txt'
const pattern = new RegExp(regexEscapeString(userInput))
pattern.test('file[1].txt') // true
```

### Rich Regex Execution

```ts
import { rexec } from '@bemoje/regex'

const regex = /(?<word>\w+)/g
const text = 'Hello World'

const results = rexec(regex, text)
// [
//   {
//     index: 0,
//     lastIndex: 5,
//     match: 'Hello',
//     groups: { word: 'Hello' },
//     location: [1, 0]       // [line, column]
//   },
//   {
//     index: 6,
//     lastIndex: 11,
//     match: 'World',
//     groups: { word: 'World' },
//     location: [1, 6]
//   }
// ]
```

### Line and Column Tracking

```ts
import { rexec } from '@bemoje/regex'

const code = 'const a = 1\nconst b = 2\nconst c = 3'
const results = rexec(/const/g, code)

results.forEach((r) => {
  console.log(`Found "${r.match}" at line ${r.location[0]}, col ${r.location[1]}`)
})
// Found "const" at line 1, col 0
// Found "const" at line 2, col 0
// Found "const" at line 3, col 0
```

## API Reference

| Export              | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| `regexEscapeString` | Escape special regex characters in a string                                             |
| `rexec`             | Execute a regex returning detailed results with index, groups, and line/column location |
| `RexecResult`       | Type for individual match results                                                       |
