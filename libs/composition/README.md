# @bemoje/composition

Class composition utilities for views, proxy-based inheritance, object inspection, and parent-child relationships.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

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

## API Reference

### Views

| Export  | Description                                         |
| ------- | --------------------------------------------------- |
| `View`  | Base class wrapping a target object for composition |
| `IView` | Interface for the View pattern                      |

### Prototype Inheritance

| Function                            | Description                             |
| ----------------------------------- | --------------------------------------- |
| `inheritProxifiedPrototype`         | Inherit all prototype members via proxy |
| `inheritProxifiedPrototypeProperty` | Inherit a single property via proxy     |

### Inspector

| Export                       | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `Inspector`                  | Deep inspection with configurable display and serialization |
| `inspectorDefaults`          | Default inspector configuration                             |
| `inspectDefaults`            | Default inspect behavior                                    |
| `ignoreValuesDefaults`       | Default ignored value patterns                              |
| `ignoreValuesFilterDefaults` | Default filter for ignored values                           |

### Parenting

| Export                | Description                                    |
| --------------------- | ---------------------------------------------- |
| `Parenting`           | Mixin for parent-child relationship management |
| `ParentRelationTypes` | Registry of parent relation types              |
