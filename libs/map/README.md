# @bemoje/map

Extended Map class and utilities for sorting, filtering, mapping, and managing key-value data.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**ExtMap**](./src/ExtMap.ts): Minimal Extended Map class focused only on Map-specific utilities.
- [**TimeoutWeakMap**](./src/TimeoutWeakMap.ts): A WeakMap with automatic timeout-based expiry for entries. Entries are automatically removed after a specified timeout period. Accessing an entry refreshes its timeout, extending its lifetime. This is useful for caching scenarios where you want automatic cleanup of unused entries while keeping frequently accessed ones alive.
- [**countUniques**](./src/countUniques.ts): Count unique occurrences of values in an iterable, returning a sorted map by count descending.
- [**entriesArray**](./src/entriesArray.ts): Returns an array of all key-value pairs in the map. Convenience method that converts the entries iterator to an array.
- [**isGenericMap**](./src/isGenericMap.ts): Checks if the provided value implements the Map interface with the specified required properties.
- [**keysArray**](./src/keysArray.ts): Returns an array of all keys in the map. Convenience method that converts the keys iterator to an array.
- [**mapGetOrDefault**](./src/mapGetOrDefault.ts): Gets a value from a map or creates it using a factory function if it doesn't exist.
- [**mapLoad**](./src/mapLoad.ts): Loads multiple entries into the map from an iterable.
- [**mapReverse**](./src/mapReverse.ts): Reverses the order of entries in a Map.
- [**mapUpdate**](./src/mapUpdate.ts): Updates a value in the map using an update function.
- [**sort**](./src/sort.ts): Sorts the map entries using a custom comparison function and updates the map in place. This is Map-specific because it maintains insertion order.
- [**sortByKeys**](./src/sortByKeys.ts): Sorts the map entries by their keys and updates the map in place.
- [**sortByValues**](./src/sortByValues.ts): Sorts the map entries by their values and updates the map in place.
- [**toMap**](./src/toMap.ts): Converts a GenericMap to a native Map.
- [**valuesArray**](./src/valuesArray.ts): Returns an array of all values in the map. Convenience method that converts the values iterator to an array.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/map
```

## Usage

### ExtMap

An extended Map with built-in sorting, filtering, mapping, and chaining:

```ts
import { ExtMap } from '@bemoje/map'

const map = new ExtMap<string, number>()
  .load([
    ['c', 3],
    ['a', 1],
    ['b', 2],
  ])
  .sortByKeys((a, b) => a.localeCompare(b))

map.entriesArray() // [['a', 1], ['b', 2], ['c', 3]]
map.keysArray() // ['a', 'b', 'c']
map.valuesArray() // [1, 2, 3]

// Filter, map, reduce
const big = map.filter((v) => v > 1) // ExtMap { 'b' => 2, 'c' => 3 }
const doubled = map.mapValues((v) => v * 2) // ExtMap { 'a' => 2, 'b' => 4, 'c' => 6 }
const sum = map.reduce((acc, v) => acc + v, 0) // 6

// From objects
const fromObj = ExtMap.fromObject({ x: 10, y: 20 })
fromObj.toObject() // { x: 10, y: 20 }
```

### TimeoutWeakMap

A WeakMap with automatic timeout-based expiry:

```ts
import { TimeoutWeakMap } from '@bemoje/map'

const cache = new TimeoutWeakMap<object, string>(5000) // 5s default TTL

const key = {}
cache.set(key, 'cached-value')
cache.get(key) // 'cached-value' (refreshes timeout)

// Auto-expires after 5 seconds of no access

// Get-or-create pattern
cache.getOrDefault(key, () => 'computed-value')

// Custom timeout per entry
cache.set(key, 'short-lived', 1000) // 1s TTL
```

### Standalone Utilities

```ts
import { mapUpdate, mapGetOrDefault, mapReverse, mapLoad, sortByValues } from '@bemoje/map'

const m = new Map<string, number>()
mapLoad(m, [
  ['a', 1],
  ['b', 2],
])
mapUpdate(m, 'a', (v) => (v ?? 0) + 10) // Map { 'a' => 11, 'b' => 2 }
mapGetOrDefault(m, 'c', () => 99) // 99 (inserted into map)
mapReverse(m) // reverses entry order in-place
sortByValues(m, (a, b) => a - b) // sorts entries by value in-place
```
