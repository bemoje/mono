import { describe } from 'vitest'
import { expect } from 'vitest'
import { inheritProxifiedPrototype } from './inheritProxifiedPrototype'
import { it } from 'vitest'

describe(inheritProxifiedPrototype.name, () => {
  it('should inherit methods from target class to viewer class', () => {
    class Target {
      greet() {
        return 'hello'
      }
    }
    class Viewer {
      constructor(public readonly target: Target) {}
    }
    inheritProxifiedPrototype(Viewer, Target, [])
    const target = new Target()
    const viewer = new Viewer(target) as any
    expect(viewer.greet()).toBe('hello')
  })

  it('should omit specified keys', () => {
    class Target {
      greet() {
        return 'hello'
      }
      farewell() {
        return 'bye'
      }
    }
    class Viewer {
      constructor(public readonly target: Target) {}
    }
    inheritProxifiedPrototype(Viewer, Target, ['farewell'])
    const target = new Target()
    const viewer = new Viewer(target) as any
    expect(viewer.greet()).toBe('hello')
    expect(viewer.farewell).toBeUndefined()
  })

  it('should exclude constructor and Symbol.toStringTag', () => {
    class Target {
      get [Symbol.toStringTag]() {
        return 'Target'
      }
      greet() {
        return 'hello'
      }
    }
    class Viewer {
      constructor(public readonly target: Target) {}
    }
    inheritProxifiedPrototype(Viewer, Target, [])
    const viewer = new Viewer(new Target()) as any
    expect(viewer.greet()).toBe('hello')
    expect(viewer.constructor).toBe(Viewer)
  })

  it('should return the ViewerClass', () => {
    class Target {
      greet() {
        return 'hello'
      }
    }
    class Viewer {
      constructor(public readonly target: Target) {}
    }
    const result = inheritProxifiedPrototype(Viewer, Target, [])
    expect(result).toBe(Viewer)
  })

  it('should handle omitKeys being falsy', () => {
    class Target {
      greet() {
        return 'hello'
      }
    }
    class Viewer {
      constructor(public readonly target: Target) {}
    }
    inheritProxifiedPrototype(Viewer, Target, undefined as any)
    const viewer = new Viewer(new Target()) as any
    expect(viewer.greet()).toBe('hello')
  })
})
