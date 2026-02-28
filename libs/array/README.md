# @bemoje/array

Array manipulation and table processing utilities for TypeScript.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/array
```

## Usage

### Math & Aggregation

```ts
import { arrSum, arrAverage } from '@bemoje/array'

arrSum([1, 2, 3, 4, 5])
// => 15

arrAverage([10, 20, 30])
// => 20
```

### Element Access

```ts
import { arrLast, arrGetOrDefault } from '@bemoje/array'

arrLast([1, 2, 3])
// => 3

const arr: string[] = []
arrGetOrDefault(arr, 0, () => 'fallback')
// => 'fallback'  (also sets arr[0])
```

### Sorting & Shuffling

```ts
import { arrSortNumeric, arrSortedInsertionIndex, arrShuffle, arrSwap } from '@bemoje/array'

arrSortNumeric([5, 2, 10, 1])
// => [1, 2, 5, 10]

const sorted = [1, 3, 5, 7]
arrSortedInsertionIndex(sorted, 4, (a, b) => a - b)
// => 2

arrShuffle([1, 2, 3, 4, 5])
// => [3, 1, 5, 2, 4] (randomized in-place)

arrSwap([1, 2, 3], 0, 2)
// => [3, 2, 1]
```

### Searching

```ts
import { arrIndicesOf, arrFindIndicesOf } from '@bemoje/array'

arrIndicesOf([1, 2, 3, 2, 4, 2], 2)
// => [1, 3, 5]

arrFindIndicesOf([10, 25, 30, 5], (v) => v > 20)
// => [1, 2]
```

### Mutation & Mapping

```ts
import { arrMapMutable, arrRemoveMutable } from '@bemoje/array'

arrMapMutable([1, 2, 3], (v) => v * 2)
// => [2, 4, 6]  (modifies original array)

const arr = [1, 2, 3, 2]
arrRemoveMutable(arr, 2)
// arr is now [1, 3]
```

### Deduplication & Removal

```ts
import { arrHasDuplicates, arrRemoveDuplicates, arrRemove } from '@bemoje/array'

arrHasDuplicates([1, 2, 2, 3])
// => true

arrRemoveDuplicates([1, 2, 2, 3, 3])
// => [1, 2, 3]

arrRemove([1, 2, 3, 4], 3)
// => [1, 2, 4]  (returns new array)
```

### Conversion

```ts
import { arrayToString, arrEachToString } from '@bemoje/array'

arrayToString([1, [2, 3], 4])
// => '[1,[2,3],4]'

arrEachToString([1, true, null])
// => ['1', 'true', 'null']
```

### Table (2D Array) Operations

```ts
import {
  arrObjectsToTable,
  arrTableToObjects,
  arrTableToCsv,
  arrTableRemoveColumns,
  arrTableAssertRowsSameLength,
} from '@bemoje/array'

// Convert objects to a 2D table
const table = arrObjectsToTable([
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
])
// => [['name', 'age'], ['Alice', 30], ['Bob', 25]]

// Convert back to objects
arrTableToObjects(table)
// => [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]

// Export to CSV
arrTableToCsv(table)
// => 'name;age\nAlice;30\nBob;25'

// Remove columns by index
arrTableRemoveColumns(table, [1])
// => [['name'], ['Alice'], ['Bob']]

// Validate row lengths
arrTableAssertRowsSameLength(table) // throws if rows differ in length
```

## API Reference

### Array Operations

| Function                  | Description                                |
| ------------------------- | ------------------------------------------ |
| `arrAverage`              | Calculate the average of a numeric array   |
| `arrSum`                  | Sum all elements in a numeric array        |
| `arrLast`                 | Get the last element (throws if empty)     |
| `arrGetOrDefault`         | Get element at index or create via factory |
| `arrShuffle`              | Randomize element order in-place           |
| `arrSwap`                 | Swap two elements by index                 |
| `arrSortNumeric`          | Sort numbers/bigints/booleans numerically  |
| `arrSortedInsertionIndex` | Binary search for insertion index          |
| `arrMapMutable`           | In-place map transformation                |
| `arrFindIndicesOf`        | Find indices matching a predicate          |
| `arrIndicesOf`            | Find all indices of a value                |
| `arrHasDuplicates`        | Check for duplicate values                 |
| `arrRemoveDuplicates`     | New array with duplicates removed          |
| `arrRemove`               | New array without a given element          |
| `arrRemoveMutable`        | Remove all occurrences in-place            |
| `arrayToString`           | Condensed string representation            |
| `arrEachToString`         | Coerce each element to string              |

### Table Operations

| Function                       | Description                      |
| ------------------------------ | -------------------------------- |
| `arrObjectsToTable`            | Objects array to 2D table        |
| `arrObjectsUniqueKeys`         | Extract unique keys from objects |
| `arrTableToObjects`            | 2D table to objects array        |
| `arrTableIterateAsObjects`     | Iterate rows as keyed objects    |
| `arrTableToCsv`                | 2D table to CSV string           |
| `arrTableEachToString`         | Stringify all cells              |
| `arrTableRemoveColumns`        | Remove columns by index          |
| `arrTableAssertRowsSameLength` | Assert uniform row length        |
