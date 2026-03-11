# @bemoje/composition

Class composition utilities for views, proxy-based inheritance, object inspection, and parent-child relationships.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**Inspector**](./src/inspector/Inspector.ts): Interface that target objects must implement to be inspectable. Provides standard inspection methods for debugging and serialization.
- [**OptionsConfigurator**](./src/OptionsConfigurator.ts): A utility function to configure options based on a given schema or properties. This function provides a builder pattern to define and validate options, including handling default values, required keys, and optional keys.
- [**ParentRelationTypes**](./src/parenting/ParentRelationTypes.ts): Manages parent-child relationships between constructor types, tracking hierarchical connections and providing debugging capabilities.
- [**Parenting**](./src/parenting/Parenting.ts): Class that handles the parent-child relationships between objects on their behalf. In order to avoid circular references, all children keep a weak reference to their parent. However, it is not guaranteed. Two objects could in principle mutually be both each other's parent and child at the same time which would allow circular references to exist.
- [**View**](./src/View.ts): Base class providing view functionality over a target object using the Composition pattern.
- [**ignoreValuesDefaults**](./src/inspector/defaults/ignoreValuesDefaults.ts): Default options for ignoring specific values during object inspection.
- [**ignoreValuesFilterDefaults**](./src/inspector/defaults/ignoreValuesFilterDefaults.ts): Default filter functions for ignoring values during object inspection.
- [**inheritProxifiedPrototype**](./src/inheritProxifiedPrototype.ts): Inherits prototype properties from a target class to a viewer class with proxification, excluding specified keys.
- [**inheritProxifiedPrototypeProperty**](./src/inheritProxifiedPrototypeProperty.ts): Inherits a single prototype property from a target class to a viewer class with proxification.
- [**inspectDefaults**](./src/inspector/defaults/inspectDefaults.ts): Default options for Node.js util.inspect with enhanced settings for better debugging output.
- [**inspectorDefaults**](./src/inspector/defaults/inspectorDefaults.ts): The default inspector configuration options.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/composition
```

## Features

- **View pattern** - Compose objects through a target wrapper abstraction
- **Proxy inheritance** - Inherit prototype members via proxy redirection
- **Inspector** - Deep object inspection with customizable formatting and serialization
- **Parenting** - Manage parent-child relationships between objects with weak references

## Usage

### View

The `View` class wraps a target object, enabling the composition pattern:

```ts
import { View } from '@bemoje/composition'

class UserView extends View<{ name: string; email: string }> {
  get displayName() {
    return this.target.name.toUpperCase()
  }
}

const view = new UserView({ name: 'Alice', email: 'alice@example.com' })
view.displayName // => 'ALICE'
view.target.email // => 'alice@example.com'
```

### Proxy-Based Prototype Inheritance

Redirect prototype method calls through a proxy to the view's target:

```ts
import { View, inheritProxifiedPrototype } from '@bemoje/composition'

class DataStore {
  items: string[] = []
  add(item: string) {
    this.items.push(item)
  }
  count() {
    return this.items.length
  }
}

class DataView extends View<DataStore> {}

// Inherit DataStore methods on DataView, proxied through .target
inheritProxifiedPrototype(DataView, DataStore, ['items'])

const store = new DataStore()
const view = new DataView(store) as DataView & DataStore
view.add('hello') // calls store.add('hello')
view.count() // => 1
```

### Inspector

Compose classes with customizable inspection for `console.log`, `util.inspect`, and `JSON.stringify`:

```ts
import { Inspector } from '@bemoje/composition'

class Config {
  host = 'localhost'
  port = 3000
  secret = 'my-secret'
}

Inspector.compose(Config, {
  keys: ['host', 'port'], // only show these in output
  ignoreValues: { undefined: true }, // hide undefined values
})

const config = new Config()
console.log(config)
// Config { host: 'localhost', port: 3000 }

JSON.stringify(config)
// '{"host":"localhost","port":3000}'
```

### Parenting

Manage parent-child object relationships with automatic weak reference tracking:

```ts
import { Parenting } from '@bemoje/composition'

@Parenting.compose
class TreeNode {
  name: string
  declare parenting: Parenting

  constructor(name: string, parent?: TreeNode) {
    this.name = name
    this.parenting.onInstance(parent ?? null)
  }
}

const root = new TreeNode('root')
const child = new TreeNode('child', root)

child.parenting.getParent() // => root
```
