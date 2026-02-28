# @bemoje/object

Comprehensive object manipulation utilities for property definition, traversal, filtering, mapping, prototype chains, and descriptor management.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/object
```

## Usage

### Object Assignment

```ts
import { objAssign } from '@bemoje/object'

// Like Object.assign but skips null/undefined values
objAssign({ a: 1, b: 2 }, { b: null, c: 3 })
// { a: 1, b: 2, c: 3 }
```

### Property Definition

```ts
import { defineGetter, defineSetter, defineMethod, defineValue, defineLazyProperty } from '@bemoje/object'

const obj = {}

defineGetter(obj, 'now', () => Date.now())
defineMethod(obj, 'greet', function () {
  return 'hello'
})
defineValue(obj, 'version', '1.0.0')

// Lazy property: computed once on first access, then cached
defineLazyProperty(obj, 'config', () => loadExpensiveConfig())
```

### Filter and Map Objects

```ts
import { filterObject, mapObject, mapObjectKeys, mapObjectEntries } from '@bemoje/object'

const data = { a: 1, b: 2, c: 3 }

filterObject(data, (value) => value > 1)
// { b: 2, c: 3 }

mapObject(data, (value) => value * 10)
// { a: 10, b: 20, c: 30 }

mapObjectKeys(data, (key) => key.toUpperCase())
// { A: 1, B: 2, C: 3 }
```

### Prototype Chain Inspection

```ts
import { getPrototypeChain, getClassChain, getSuperClasses } from '@bemoje/object'

class Animal {}
class Dog extends Animal {}

getPrototypeChain(new Dog()) // [Dog.prototype, Animal.prototype, Object.prototype, null]
getClassChain(Dog) // [Animal, Object]
getSuperClasses(Dog) // [Animal, Object]
```

### Inheritance Utilities

```ts
import { inheritPrototypeMembers, inheritStaticMembers } from '@bemoje/object'

// Copy prototype methods from source to target class
inheritPrototypeMembers(TargetClass, SourceClass, ['excludeMethod'])
inheritStaticMembers(TargetClass, SourceClass)
```

### Deep Operations

```ts
import { objDeepFreeze, iterateObject } from '@bemoje/object'

// Deep freeze an object
const frozen = objDeepFreeze({ nested: { deep: { value: 42 } } })

// Traverse all properties depth-first
for (const node of iterateObject({ a: { b: [1, 2] } })) {
  console.log(node.propertyPath, node.value, node.isLeaf)
}
// 'a'       { b: [1, 2] }  false
// 'a.b'     [1, 2]         false
// 'a.b[0]'  1              true
// 'a.b[1]'  2              true
```

### Sort, Delete, Reduce

```ts
import { objSortKeys, objDelete, objReduce, objIsEmpty } from '@bemoje/object'

objSortKeys({ c: 3, a: 1, b: 2 }) // { a: 1, b: 2, c: 3 }
objDelete({ name: 'John', age: 30 }, 'age') // { name: 'John' }
objReduce({ a: 1, b: 2 }, (acc, val) => acc + val, 0) // 3
objIsEmpty({}) // true
```

### Typed Helpers

```ts
import { keysOf, valuesOf, entriesOf } from '@bemoje/object'

const obj = { name: 'Alice', age: 30 }
keysOf(obj) // ['name', 'age']  (typed as ('name' | 'age')[])
valuesOf(obj) // ['Alice', 30]
entriesOf(obj) // [['name', 'Alice'], ['age', 30]]
```

## API Reference

| Export                      | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| `objAssign`                 | Object.assign that skips null/undefined values            |
| `objDeepFreeze`             | Deep freeze an object recursively                         |
| `objSortKeys`               | Sort object keys alphabetically or with custom comparator |
| `objDelete`                 | Delete a key and return the object                        |
| `objReduce`                 | Reduce over object entries                                |
| `objForEach`                | Iterate over object entries                               |
| `objIsEmpty`                | Check if object has no enumerable keys                    |
| `objSize`                   | Count enumerable keys                                     |
| `objGet`                    | Type-safe property getter                                 |
| `objSet`                    | Set a property and return the value                       |
| `objHas`                    | Check if key exists                                       |
| `objUpdate`                 | Update a value with a callback                            |
| `objGetOrDefault`           | Get or create value with factory function                 |
| `objGetOrDefaultValue`      | Get or set a default value                                |
| `objToMap`                  | Convert object to Map                                     |
| `objOmitKeysMutable`        | Delete multiple keys from an object                       |
| `filterObject`              | Filter object properties by predicate                     |
| `filterObjectMutable`       | Filter object in-place                                    |
| `mapObject`                 | Map over object values                                    |
| `mapObjectKeys`             | Map over object keys                                      |
| `mapObjectEntries`          | Map over object entries (both key and value)              |
| `defineGetter`              | Define a getter property                                  |
| `defineSetter`              | Define a setter property                                  |
| `defineAccessors`           | Define getter and setter                                  |
| `defineMethod`              | Define a method property                                  |
| `defineValue`               | Define a value property                                   |
| `defineProperty`            | Define a property with descriptor                         |
| `defineLazyProperty`        | Define a lazy-evaluated cached property                   |
| `keysOf`                    | Typed Object.keys                                         |
| `valuesOf`                  | Typed Object.values                                       |
| `entriesOf`                 | Typed Object.entries                                      |
| `getPrototypeChain`         | Get prototype chain as array                              |
| `getClassChain`             | Get class constructor chain                               |
| `getSuperClass`             | Get immediate superclass                                  |
| `getSuperClasses`           | Get all superclasses                                      |
| `inheritPrototypeMembers`   | Copy prototype members between classes                    |
| `inheritStaticMembers`      | Copy static members between classes                       |
| `iterateObject`             | Depth-first object traversal generator                    |
| `deleteNullishPropsMutable` | Remove null/undefined properties                          |
| `className`                 | Get class name from an instance                           |
| `constructorOf`             | Get constructor of an object                              |
| `hasOwnProperty`            | Safe hasOwnProperty check                                 |
| `hasProperty`               | Check own + prototype chain                               |
| `getKeys`                   | Get keys with filtering options                           |
| `OptionsConfigurator`       | Builder pattern for typed options with defaults           |
