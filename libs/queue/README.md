# @bemoje/queue

Async task queue with dependency resolution, priority scheduling, and concurrency control.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**AsyncDependencyQueue**](./src/lib/AsyncDependencyQueue.ts): Represents an asynchronous queue that manages task execution based on dependencies and priority.
- [**hasCircularDependencies**](./src/lib/hasCircularDependencies.ts): Depth-first search (DFS) algorithm to detect circular dependencies in our task definition graph.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/queue
```

## Features

- Dependency-aware task execution - tasks run only after their dependencies complete
- Priority-based scheduling - higher priority tasks run first among ready tasks
- Configurable concurrency limit
- Circular dependency detection with clear error messages
- Type-safe task names enforced at compile time
- Built on [p-queue](https://github.com/sindresorhus/p-queue)

## Usage

### Basic Example

```ts
import { AsyncDependencyQueue } from '@bemoje/queue'

const queue = new AsyncDependencyQueue({
  concurrency: 2,
  taskDefinitions: {
    install: {
      dependencies: [],
      run: async () => {
        console.log('Installing...')
      },
    },
    build: {
      dependencies: ['install'],
      run: async () => {
        console.log('Building...')
      },
    },
    test: {
      dependencies: ['build'],
      run: async () => {
        console.log('Testing...')
      },
    },
    lint: {
      dependencies: ['install'],
      run: async () => {
        console.log('Linting...')
      },
      priority: 1, // runs before 'build' if both are ready
    },
  },
})

await queue.run()
// install -> lint & build (concurrent) -> test
```

### Circular Dependency Detection

```ts
import { hasCircularDependencies } from '@bemoje/queue'

const tasks = { a: { dependencies: ['b'], run: async () => {} }, b: { dependencies: ['a'], run: async () => {} } }

hasCircularDependencies(tasks) // => true
```
