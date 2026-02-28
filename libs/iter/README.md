# @bemoje/iter

Utility functions for working with iterables, especially map-like key-value pair structures.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

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

## API Reference

| Export              | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `mapIterable`       | Transform both keys and values of map-like entries      |
| `mapIterableKeys`   | Transform keys while preserving values                  |
| `mapIterableValues` | Transform values while preserving keys                  |
| `filterIterable`    | Filter map entries by predicate                         |
| `reduceIterable`    | Reduce a map-like iterable to a single value            |
| `forEachIterable`   | Execute a callback for each entry                       |
| `countUniques`      | Count unique values in an iterable, sorted by frequency |
| `toObjectIterable`  | Convert key-value iterable to a plain object            |
