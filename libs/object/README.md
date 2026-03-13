# @bemoje/object

Comprehensive object manipulation utilities for property definition, traversal, filtering, mapping, prototype chains, and descriptor management.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**arrAssign**](./src/arrAssign.ts): Array assignment function that merges arrays excluding null and undefined values.
- [**className**](./src/className.ts): Get the class name of an object from its constructor.
- [**constructorOf**](./src/constructorOf.ts): Returns the constructor of the given object.
- [**createArrayMerger**](./src/createArrayMerger.ts): Creates a function that merges arrays based on a predicate function.
- [**createObjectMerger**](./src/createObjectMerger.ts): Creates a function that merges objects based on a predicate function.
- [**defineAccessors**](./src/defineAccessors.ts): Define accessor properties (getter and setter) on an object with enhanced descriptor handling.
- [**defineGetter**](./src/defineGetter.ts): Define a getter property on an object with enhanced descriptor handling.
- [**defineLazyProperty**](./src/defineLazyProperty.ts): Define a lazy property that evaluates its getter on first access and then caches the value.
- [**defineMethod**](./src/defineMethod.ts): Define a method property on an object with enhanced descriptor handling.
- [**defineProperty**](./src/defineProperty.ts): Utility function for defining properties on objects with enhanced descriptor handling.
- [**defineSetter**](./src/defineSetter.ts): Define a setter property on an object with enhanced descriptor handling.
- [**defineValue**](./src/defineValue.ts): Define a value property on an object with enhanced descriptor handling.
- [**deleteNullishPropsMutable**](./src/deleteNullishPropsMutable.ts): Mutably delete enumerable properties with null or undefined values.
- [**entriesOf**](./src/entriesOf.ts): Same as Object.entries except the keys are typed as keyof T.
- [**filterObject**](libs/iter/src/filterObject.ts): Filter an object's own enumerable properties by predicate.
- [**filterObjectMutable**](./src/filterObjectMutable.ts): Mutably filter an object's own properties based on a given predicate.
- [**getClassChain**](./src/getClassChain.ts): Get the class constructor chain for any target (constructor, prototype, or instance). Always returns constructors/classes, never prototype objects. By default excludes the target's own constructor (returns superclasses only).
- [**getConfigurableMethodOrGetterKeys**](./src/getConfigurableMethodOrGetterKeys.ts): Returns an array of keys representing configurable methods or getters of an object.
- [**getKeys**](./src/getKeys.ts): Returns an array of the own property keys of an object. Every combination of ways to toggle enumerable/non-enumerable/strings/symbols are available. Ignoring specific keys is also possible.
- [**getKeysPreset**](./src/getKeysPreset.ts): Creates a preset function for getting object keys with specific filtering options.
- [**getOwnProperty**](./src/getOwnProperty.ts): Returns a given own property value of a given object.
- [**getPrototypeChain**](./src/getPrototypeChain.ts): Get the prototype chain of any object. Returns prototype objects, not constructors.
- [**getSuperClass**](./src/getSuperClass.ts): Get the immediate superclass of a target. Returns Object if no meaningful superclass exists.
- [**getSuperClasses**](./src/getSuperClasses.ts): Get all superclasses of a target (excluding the target itself by default). Simpler version without overloads - just returns the class chain.
- [**hasOwnProperty**](./src/hasOwnProperty.ts): Object.prototype.hasOwnProperty.call
- [**hasProperty**](./src/hasProperty.ts): Determines if a property is defined on an object, including 'own' and prototype chain.
- [**hasPrototypeChainProperty**](./src/hasPrototypeChainProperty.ts): Determines if a property is defined on an object's prototype prototype chain, not including the object itself.
- [**inheritPrototypeMembers**](./src/inheritPrototypeMembers.ts): Copies prototype members from a source constructor to a target constructor, excluding specified keys.
- [**inheritStaticMembers**](./src/inheritStaticMembers.ts): Copies static members from a source constructor to a target constructor, excluding specified keys.
- [**isAccessorDescriptor**](./src/isAccessorDescriptor.ts): Check if the given descriptor is an accessor descriptor.
- [**isEnumerable**](./src/isEnumerable.ts): Check if the property is enumerable.
- [**isMethodValueDescriptor**](./src/isMethodValueDescriptor.ts): Checks if a property descriptor represents a method (function value descriptor).
- [**isValueDescriptor**](./src/isValueDescriptor.ts): Check if the given descriptor is a value descriptor.
- [**iterableFirstElement**](./src/iterableFirstElement.ts): Returns the first element of an iterable object.
- [**iterateObject**](./src/iterateObject.ts): Generator that performs a depth-first traversal of an object's structure. Yields information about each node including its path, value, and container type. Handles circular references and maintains parent-child relationships. Key features: - Supports both objects and arrays - Generates Lodash-style property paths - Detects leaf nodes (primitives) - Prevents circular reference loops - Preserves traversal order
- [**keysOf**](./src/keysOf.ts): Same as Object.keys except the keys are typed as string keys of T.
- [**mapObjectEntries**](./src/mapObjectEntries.ts): Maps over an object's entries, transforming both keys and values using the provided function.
- [**mapObjectKeys**](./src/mapObjectKeys.ts): Maps over an object's keys, transforming each key using the provided function while preserving values.
- [**objAssign**](./src/objAssign.ts): Like Object.assign, but only copies source object property values != null.
- [**objDeepFreeze**](./src/objDeepFreeze.ts): Deep freezes an object. Note: Deep recursion may cause stack overflow for very deeply nested objects.
- [**objDefineLazyProperty**](./src/objDefineLazyProperty.ts): Defines a lazy property on an object. The property will be lazily evaluated on the first access and then cached for subsequent accesses. The property is both enumerable and configurable.
- [**objDelete**](./src/objDelete.ts): Deletes a property from an object and returns the modified object.
- [**objGet**](./src/objGet.ts): Retrieves the value associated with the specified key from an object.
- [**objGetOrDefault**](./src/objGetOrDefault.ts): Gets a property value from an object or creates it using a factory function if it doesn't exist.
- [**objGetOrDefaultValue**](./src/objGetOrDefaultValue.ts): This function attempts to retrieve a value from an object using a provided key. If the key does not exist in the object, it sets the provided default value in the object and returns it.
- [**objHas**](./src/objHas.ts): Checks if an object has a specific key.
- [**objOmitKeysMutable**](./src/objOmitKeysMutable.ts): Deletes the specified keys from an object in a mutable way.
- [**objPropertyValueToGetter**](./src/objPropertyValueToGetter.ts): Converts the specified properties of an object into getter functions.
- [**objSet**](./src/objSet.ts): Sets a value for a key in an object and returns the value.
- [**objSize**](./src/objSize.ts): Returns the number of enumerable keys in an object.
- [**objSortKeys**](./src/objSortKeys.ts): Sorts the keys of an object in alphabetical order unless a custom compare function is provided.
- [**objToMap**](./src/objToMap.ts): Converts an object to a Map.
- [**objUpdate**](./src/objUpdate.ts): Updates the value of a specific key in an object using a callback function.
- [**objUpdatePropertyDescriptors**](./src/objUpdatePropertyDescriptors.ts): Updates the property descriptors of the specified properties on the given object.
- [**propertyIsEnumerable**](./src/propertyIsEnumerable.ts): Calls Object.prototype.propertyIsEnumerable on the given object.
- [**setEnumerable**](./src/setEnumerable.ts): Sets the enumerable property of the specified properties of an object to true.
- [**setNonConfigurable**](./src/setNonConfigurable.ts): Sets the specified properties of an object as non-configurable.
- [**setNonEnumerable**](./src/setNonEnumerable.ts): Sets the specified properties of an object as non-enumerable.
- [**setNonWritable**](./src/setNonWritable.ts): Sets the specified properties of an object to be non-writable.
- [**setWritable**](./src/setWritable.ts): Sets the specified properties of an object to be non-writable.
- [**sortKeys**](./src/sortKeys.ts): Sort an object's keys.
- [**sortKeysLike**](./src/sortKeysLike.ts): Sorts the keys of an object in the given order.
- [**staticClassKeysOf**](./src/staticClassKeysOf.ts): Returns the static string-property keys of a class but without the natively built-in keys 'length', 'name', and 'prototype'.
- [**valuesOf**](./src/valuesOf.ts): Get the values of an object with type-safe return value.

<!-- EXPORTS_END -->

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
