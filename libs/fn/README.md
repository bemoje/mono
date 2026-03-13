# @bemoje/fn

Higher-order function utilities for argument binding, context manipulation, spying, and method wrapping.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**bindArg**](./src/bindArg.ts): Binds a specified argument to the provided function, returning a new function that requires only the remaining arguments at call time.
- [**bindArgs**](./src/bindArgs.ts): Binds specified arguments to the provided function, returning a new function that requires only the remaining arguments at call time.
- [**dethisify**](./src/dethisify.ts): Converts a function from a class method by by making the first argument take the place of the 'this' context. The reverse of
- [**functionSpy**](./src/functionSpy.ts): Wraps a function so that the given
- [**setLength**](./src/setLength.ts): Set the length of a function.
- [**setName**](./src/setName.ts): Set the name of a function.
- [**setNameAndLength**](./src/setNameAndLength.ts): Preserves the name and length of a function or class constructor
- [**thisProxy**](./src/thisProxy.ts): Returns a function that redirects or 'proxies' the 'this' context of the input function to a property of a given key.
- [**thisify**](./src/dethisify.ts): Converts a function to a class method by making the 'this' context the first argument.
- [**transformReturnValue**](./src/transformReturnValue.ts): Wraps a function to transform its return value using a transform function.
- [**wrapMethods**](./src/wrapMethods.ts): Wrap methods, getters and setters of an object with custom logic.

<!-- EXPORTS_END -->

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
import { setName, setLength, setNameAndLength } from '@bemoje/fn'

const fn = () => {}
setName('myFn', fn) // fn.name === 'myFn'
setLength(3, fn) // fn.length === 3
```
