# @bemoje/decorators

TypeScript decorators for lazy property initialization and method memoization.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/decorators
```

## Usage

### Lazy Properties

Defer expensive computation until first access, then cache the result:

```ts
import { lazyProp } from '@bemoje/decorators'

class Config {
  @lazyProp
  get expensiveValue() {
    console.log('Computing...')
    return Array.from({ length: 1000 }, (_, i) => i * i)
  }
}

const config = new Config()
config.expensiveValue // logs 'Computing...', returns array
config.expensiveValue // returns cached array (no recomputation)
```

### Lazy Properties with Expiry

Cache values with automatic timeout-based invalidation:

```ts
import { lazyProp } from '@bemoje/decorators'

class DataService {
  @lazyProp('5 min') // re-fetches after 5 minutes
  get cachedData() {
    return fetchFromDatabase()
  }

  @lazyProp(30000) // re-fetches after 30 seconds
  get frequentlyUpdated() {
    return getLatestMetrics()
  }
}
```

### Sync Memoization

Cache method results based on arguments:

```ts
import { memoizeSync } from '@bemoje/decorators'

class MathService {
  @memoizeSync()
  fibonacci(n: number): number {
    if (n <= 1) return n
    return this.fibonacci(n - 1) + this.fibonacci(n - 2)
  }
}

const svc = new MathService()
svc.fibonacci(40) // computed once, cached for subsequent calls
```

### Async Memoization

Cache async method results with optional TTL:

```ts
import { memoizeAsync } from '@bemoje/decorators'

class ApiClient {
  @memoizeAsync('10 min')
  async fetchUser(id: string) {
    const res = await fetch(`/api/users/${id}`)
    return res.json()
  }
}

const client = new ApiClient()
await client.fetchUser('123') // fetches from API
await client.fetchUser('123') // returns cached result
```

## API Reference

| Export                            | Description                                                          |
| --------------------------------- | -------------------------------------------------------------------- |
| `lazyProp`                        | Decorator for lazy-initialized getters and methods with optional TTL |
| `memoizeSync`                     | Decorator for caching synchronous method results                     |
| `memoizeAsync`                    | Decorator for caching async method results with Promise support      |
| `assertDescriptorValueIsFunction` | Guard asserting a descriptor value is a function                     |
