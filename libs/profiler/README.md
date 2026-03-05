# @bemoje/profiler

Performance profiling utilities for measuring execution time of functions, class methods, and modules.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/profiler
```

## Usage

### Profile a Standalone Function

```ts
import { Profiler } from '@bemoje/profiler'

const add = Profiler.fn('add', (a: number, b: number) => a + b)

add(1, 2) // 3
add(3, 4) // 7

Profiler.printResults()
// Execution time (microseconds)  calls  total  avg  min  max
// add()                          2      5      2    2    3
```

### Profile a Class

```ts
import { Profiler } from '@bemoje/profiler'

@Profiler.class
class Calculator {
  add(a: number, b: number) {
    return a + b
  }
  multiply(a: number, b: number) {
    return a * b
  }
}

// Or without decorators:
Profiler.class(Calculator)

// All methods are now profiled (prototype + static)
const calc = new Calculator()
calc.add(1, 2)
calc.multiply(3, 4)

Profiler.printResults()
```

### Profile a Module

```ts
import { Profiler } from '@bemoje/profiler'
import * as mathUtils from './mathUtils'

Profiler.module(mathUtils, 'mathUtils')

mathUtils.sum([1, 2, 3])
mathUtils.average([1, 2, 3])

Profiler.printResults()
// Execution time (microseconds)  calls  total  avg  min  max
// mathUtils.sum()                1      12     12   12   12
// mathUtils.average()            1      8      8    8    8
```

### Options and Control

```ts
import { Profiler } from '@bemoje/profiler'

// Disable profiling globally (wraps become no-ops)
Profiler.enabled = false

// Ignore specific keys when profiling a class
Profiler.class(MyClass, { ignoreStaticKeys: ['create'], ignorePrototypeKeys: ['toString'] })

// Sort results by total time
Profiler.printResults({ sortBy: 'totalTimeUs' })

// Get raw results as data
const results = Profiler.getResults({ sortBy: 'calls' })
// [['methodName', { calls, totalTimeUs, avgTimeUs, minTimeUs, maxTimeUs }], ...]
```

## API Reference

| Export                    | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `Profiler`                | Main class with static methods for profiling              |
| `Profiler.fn`             | Wrap a standalone function with profiling                 |
| `Profiler.class`          | Profile all methods of a class (decorator or direct call) |
| `Profiler.classStatic`    | Profile only static methods of a class                    |
| `Profiler.classPrototype` | Profile only prototype methods of a class                 |
| `Profiler.module`         | Profile all exported functions of a module object         |
| `Profiler.getResults`     | Get profiling results as structured data                  |
| `Profiler.printResults`   | Print a formatted profiling table to the console          |
| `Profiler.enabled`        | Enable or disable profiling globally                      |
| `Profiler.data`           | Access all profiler instances                             |
