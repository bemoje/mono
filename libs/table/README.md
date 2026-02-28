# @mono/table

Table formatting and string processing utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Usage

### Table Formatting

```ts
import { formatAsStringTable, TableFormatter } from '@mono/table'

const data = [
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob', age: 25, active: false },
]

const result = formatAsStringTable(data, {
  keys: ['name', 'age'],
  formatters: [{ key: 'name', format: (val) => val.toUpperCase() }],
})
```

### Table Iteration & Data Conversion

```ts
import { objectsToTable, iterateTableArrayAsObjects } from '@mono/table'

// Convert array of objects to a 2D array representation
const tableArray = objectsToTable([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
])
// => [['id', 'name'], [1, 'Alice'], [2, 'Bob']]

// Iterate over table array representing rows as objects
const iter = iterateTableArrayAsObjects(tableArray)
for (const obj of iter) {
  console.log(obj)
}
```

### CSV Headers

```ts
import { getHeadersFromCsvFile, parseCsvHeaderLine } from '@mono/table'

// Extract headers from a CSV line
const headers = parseCsvHeaderLine('id,name,age', ',')
// => ['id', 'name', 'age']

// Extract headers directly from a CSV file
const fileHeaders = await getHeadersFromCsvFile('data.csv', ',')
```

## API Reference

### Formatting & Display

| Function / Class      | Description                                   |
| --------------------- | --------------------------------------------- |
| `TableFormatter`      | Class to process and format tabular data      |
| `formatAsStringTable` | Formats an array of objects as a string table |

### Data Operations

| Function                     | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `objectsToTable`             | Converts an array of objects to a 2D array table       |
| `iterateTableArrayAsObjects` | Iterate over 2D string-array rows as keyed objects     |
| `getHeadersFromCsvFile`      | Read a CSV file and return its parsed header line      |
| `parseCsvHeaderLine`         | Parse a single CSV header string into an array of keys |
