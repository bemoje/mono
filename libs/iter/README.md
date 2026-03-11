# @bemoje/iter

Utility functions for working with iterables, especially map-like key-value pair structures.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**filterArray**](./src/filterArray.ts): Filter an array based on a predicate function.
- [**filterIterable**](./src/filterIterable.ts): Filter an iterable based on a predicate function.
- [**filterIterableEntries**](./src/filterIterableEntries.ts): Filter an iterable of key-value entries based on a predicate function.
- [**filterIterableKeys**](./src/filterIterableKeys.ts): Filter an iterable of key-value entries based on a predicate function that tests keys.
- [**filterIterableValues**](./src/filterIterableValues.ts): Filter an iterable of key-value entries based on a predicate function that tests values.
- [**filterMap**](./src/filterMap.ts): Filter a Map based on a predicate function.
- [**filterObject**](./src/filterObject.ts): Filter an object's properties based on a predicate function.
- [**filterSet**](./src/filterSet.ts): Filter a Set based on a predicate function.
- [**forEachArray**](./src/forEachArray.ts): Execute a callback function for each element in an array.
- [**forEachIterable**](./src/forEachIterable.ts): Execute a callback function for each element in an iterable.
- [**forEachIterableEntries**](./src/forEachIterableEntries.ts): Execute a callback function for each entry in a map-like iterable.
- [**forEachIterableKeys**](./src/forEachIterableKeys.ts): Execute a callback function for each key in an iterable of key-value pairs.
- [**forEachIterableValues**](./src/forEachIterableValues.ts): Execute a callback function for each value in an iterable of key-value pairs.
- [**forEachMap**](./src/forEachMap.ts): Execute a callback function for each entry in a Map.
- [**forEachObject**](./src/forEachObject.ts): Execute a callback function for each property in an object.
- [**forEachSet**](./src/forEachSet.ts): Execute a callback function for each value in a Set.
- [**mapArray**](./src/mapArray.ts): Transform each element in an array using a mapper function.
- [**mapIterable**](./src/mapIterable.ts): Transform each element in an iterable using a mapper function.
- [**mapIterableEntries**](./src/mapIterableEntries.ts): Transform each entry in an iterable of key-value pairs using a mapper function.
- [**mapIterableKeys**](./src/mapIterableKeys.ts): Transform the keys in an iterable of key-value pairs using a mapper function.
- [**mapIterableValues**](./src/mapIterableValues.ts): Transform the values in an iterable of key-value pairs using a mapper function.
- [**mapMap**](./src/mapMap.ts): Transform the values in a Map using a mapper function.
- [**mapObject**](./src/mapObject.ts): Transform the values in an object using a mapper function.
- [**mapSet**](./src/mapSet.ts): Transform each value in a Set using a mapper function.
- [**reduceArray**](./src/reduceArray.ts): Reduce an array to a single value using a reducer function.
- [**reduceIterable**](./src/reduceIterable.ts): Reduce an iterable to a single value using a reducer function.
- [**reduceIterableEntries**](./src/reduceIterableEntries.ts): Reduce an iterable of key-value entries to a single value using a reducer function.
- [**reduceIterableKeys**](./src/reduceIterableKeys.ts): Reduce an iterable of key-value entries based on keys using a reducer function.
- [**reduceIterableValues**](./src/reduceIterableValues.ts): Reduce an iterable of key-value entries based on values using a reducer function.
- [**reduceMap**](./src/reduceMap.ts): Reduce a Map to a single value using a reducer function.
- [**reduceObject**](./src/reduceObject.ts): Reduce an object to a single value using a reducer function.
- [**reduceSet**](./src/reduceSet.ts): Reduce a Set to a single value using a reducer function.
- [**toObjectIterable**](./src/toObjectIterable.ts): Convert a map-like iterable to a regular object.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/iter
```

## Usage

### Transform Iterables

```ts
import { mapIterable, mapIterableKeys, mapIterableValues } from '@bemoje/iter'

const entries: Iterable<[string, number]> = new Map([
  ['a', 1],
  ['b', 2],
])

// Transform both keys and values
const mapped = mapIterable(entries, (value, key) => [key.toUpperCase(), value * 10])
// [['A', 10], ['B', 20]]

// Transform only keys
const newKeys = mapIterableKeys(entries, (key) => key.toUpperCase())
// [['A', 1], ['B', 2]]

// Transform only values
const doubled = mapIterableValues(entries, (value) => value * 2)
// [['a', 2], ['b', 4]]
```

### Filter and Reduce

```ts
import { filterIterable, reduceIterable, forEachIterable } from '@bemoje/iter'

const entries: Iterable<[string, number]> = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
])

// Filter entries by value
const filtered = filterIterable(entries, (value) => value > 1)
// [['b', 2], ['c', 3]]

// Reduce to a single value
const sum = reduceIterable(entries, (acc, value) => acc + value, 0)
// 6

// Side effects
forEachIterable(entries, (value, key) => console.log(`${key}: ${value}`))
```

### Count Unique Values

```ts
import { countUniques } from '@bemoje/iter'

const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
const counts = countUniques(words)
// ExtMap { 'apple' => 3, 'banana' => 2, 'cherry' => 1 } (sorted by count desc)
```

### Convert to Object

```ts
import { toObjectIterable } from '@bemoje/iter'

const entries: Iterable<[string, number]> = [
  ['a', 1],
  ['b', 2],
]
const obj = toObjectIterable(entries)
// { a: 1, b: 2 }
```
