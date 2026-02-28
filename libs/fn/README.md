# @bemoje/fn

Higher-order function utilities for argument binding, context manipulation, spying, and method wrapping.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/fn
```

## Usage

### Bind Arguments

Partially apply arguments at specific positions:

```ts
import { bindArg, bindArgs } from '@bemoje/fn'

function greet(greeting: string, name: string, punctuation: string) {
  return `${greeting}, ${name}${punctuation}`
}

const greetHello = bindArg(greet, 0, 'Hello')
greetHello('World', '!') // 'Hello, World!'

const greetHelloWorld = bindArgs(greet, { 0: 'Hello', 1: 'World' })
greetHelloWorld('!') // 'Hello, World!'
```

### Convert Between `this` and First Argument

```ts
import { thisify, dethisify } from '@bemoje/fn'

// Convert a standalone function into a method
function getFullName(target: { first: string; last: string }) {
  return `${target.first} ${target.last}`
}

const method = thisify(getFullName)
// Now usable as: obj.getFullName = method

// Convert a method into a standalone function
const standalone = dethisify(method)
standalone({ first: 'John', last: 'Doe' }) // 'John Doe'
```

### Redirect `this` Context

```ts
import { thisProxy } from '@bemoje/fn'

function getName(this: { name: string }) {
  return this.name
}

// Redirect `this` to a property key
const proxied = thisProxy(getName, 'inner')
// When called on { inner: { name: 'test' } }, returns 'test'
```

### Function Spy

Wrap functions with before/after hooks:

```ts
import { functionSpy, type IFunctionSpyStrategy } from '@bemoje/fn'

const timingStrategy: IFunctionSpyStrategy<unknown, number> = {
  onInvoke(_ctx, _args) {
    return performance.now()
  },
  onReturn(startTime, retval) {
    console.log(`Took ${performance.now() - startTime}ms`)
    return retval
  },
}

const timed = functionSpy(myFunction, timingStrategy)
```

### Transform Return Values

```ts
import { transformReturnValue } from '@bemoje/fn'

function getItems() {
  return [3, 1, 2]
}

const getSorted = transformReturnValue(getItems, (arr) => arr.sort())
getSorted() // [1, 2, 3]
```

### Wrap Object Methods

```ts
import { wrapMethods } from '@bemoje/fn'

wrapMethods(myObject, {
  filter: (_target, key, _type, _des) => key !== 'skip',
  onMethod: (_target, key, original) => {
    return function (...args) {
      console.log(`Calling ${String(key)}`)
      return original.apply(this, args)
    }
  },
})
```

### Function Metadata

```ts
import { setName, setLength, preserveNameAndLength } from '@bemoje/fn'

const fn = () => {}
setName('myFn', fn) // fn.name === 'myFn'
setLength(3, fn) // fn.length === 3
```

## API Reference

| Export                  | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| `bindArg`               | Bind a single argument at a specific index                       |
| `bindArgs`              | Bind multiple arguments by index                                 |
| `thisify`               | Convert standalone function to method (first arg becomes `this`) |
| `dethisify`             | Convert method to standalone function (`this` becomes first arg) |
| `thisProxy`             | Redirect `this` to a property or callback                        |
| `functionSpy`           | Wrap function with before/after hook strategy                    |
| `transformReturnValue`  | Transform a function's return value                              |
| `wrapMethods`           | Wrap all methods/getters/setters on an object                    |
| `preserveNameAndLength` | Copy name and length from source to target function              |
| `setName`               | Set the name of a function                                       |
| `setLength`             | Set the length of a function                                     |
