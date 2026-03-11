# @bemoje/array

Array manipulation and table processing utilities for TypeScript.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**arrFindIndices**](./src/arrFindIndices.ts): Returns an array of indices where the predicate function returns true for the corresponding element in the input array.
- [**arrGetOrDefault**](./src/arrGetOrDefault.ts): Get array element at index or create it using factory function if it doesn't exist.
- [**arrHasDuplicates**](./src/arrHasDuplicates.ts): Checks if an array has any duplicate elements.
- [**arrIndicesOf**](./src/arrIndicesOf.ts): Returns all indexes at which an element is found.
- [**arrMapMutable**](./src/arrMapMutable.ts): This function takes an array and a callback function as arguments. It applies the callback function to each element of the array, mutating the original array in the process.
- [**arrObjectsCommonKeys**](./src/arrObjectsCommonKeys.ts): Returns an array of keys that are common to all objects in the input array.
- [**arrObjectsToTable**](./src/arrObjectsToTable.ts): Convert an array of objects to a two-dimensional table.
- [**arrObjectsUniqueKeys**](./src/arrObjectsUniqueKeys.ts): Returns an array of all unique object keys found in an array of objects.
- [**arrSortNumeric**](./src/arrSortNumeric.ts): Sorts an array of numbers, bigints, or booleans in ascending order.
- [**arrSortedInsertionIndex**](./src/arrSortedInsertionIndex.ts): Returns an index in the sorted array where the specified value could be inserted while maintaining the sorted order of the array. If the element is already in the array, returns the index after the last instance of the element.
- [**arrSwap**](./src/arrSwap.ts): Swaps two elements in an array. This function takes an input array and swaps the elements at the specified indices.
- [**arrTableAssertRowsSameLength**](./src/arrTableAssertRowsSameLength.ts): Asserts that all rows in a 2D array have the same length.
- [**arrTableEachToString**](./src/arrTableEachToString.ts): Coerce each value of a 2D array table to string.
- [**arrTableIterateAsObjects**](./src/arrTableIterateAsObjects.ts): Generator that iterates through a 2D array table, yielding objects with header keys and row values.
- [**arrTableRemoveColumns**](./src/arrTableRemoveColumns.ts): Removes specified columns from a 2D array table.
- [**arrTableToCsv**](./src/arrTableToCsv.ts): Converts a 2D array to a CSV string.
- [**arrTableToObjects**](./src/arrTableToObjects.ts): Converts a 2D array representing a table into an array of objects.

<!-- EXPORTS_END -->

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
