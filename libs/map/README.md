# @bemoje/map

Extended Map class and utilities for sorting, filtering, mapping, and managing key-value data.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

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

## API Reference

| Export            | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `ExtMap`          | Extended Map with sort, filter, map, reduce, and chaining |
| `TimeoutWeakMap`  | WeakMap with automatic timeout-based entry expiry         |
| `mapGetOrDefault` | Get a value or create it with a factory function          |
| `mapLoad`         | Load multiple entries into a map                          |
| `mapReverse`      | Reverse the order of map entries                          |
| `mapUpdate`       | Update a map value using an update function               |
| `sort`            | Sort map entries with a custom comparator                 |
| `sortByKeys`      | Sort map entries by keys                                  |
| `sortByValues`    | Sort map entries by values                                |
| `toMap`           | Convert a GenericMap to a native Map                      |
| `keysArray`       | Get all keys as an array                                  |
| `valuesArray`     | Get all values as an array                                |
| `entriesArray`    | Get all entries as an array                               |
| `isGenericMap`    | Check if a value implements the Map interface             |
