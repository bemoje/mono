# @mono/table

Table formatting and string processing utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**TableFormatter**](./src/TableFormatter.ts): Formats a 2D array representing a table.
- [**formatAsStringTable**](./src/formatAsStringTable.ts): Formats an array of objects into a string table with customizable column formatters.
- [**getHeadersFromCsvFile**](./src/getHeadersFromCsvFile.ts): Extracts column headers from the first line of a CSV file.
- [**iterateTableArrayAsObjects**](./src/iterateTableArrayAsObjects.ts): Generator that iterates through a 2D table array, yielding objects with header keys and row values.
- [**objectsToTable**](./src/objectsToTable.ts): Convert an array of objects to a table.
- [**parseCsvHeaderLine**](./src/parseCsvHeaderLine.ts): Takes the first line of a CSV string and returns an array of column names.

<!-- EXPORTS_END -->

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
