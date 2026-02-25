import { describe } from 'vitest'
import { expect } from 'vitest'
import { inheritStaticMembers } from './inheritStaticMembers'
import { it } from 'vitest'

describe('inheritStaticMembers', () => {
  it('should copy static members from source to target', () => {
    class Source {
      static sourceMethod() {
        return 'sourceMethod'
      }
    }

    class Target {}

    inheritStaticMembers(Target, Source)

    expect((Target as any).sourceMethod()).toBe('sourceMethod')
  })

  it('should not copy ignored keys', () => {
    class Source {
      static sourceMethod() {
        return 'sourceMethod'
      }
    }

    class Target {}

    inheritStaticMembers(Target, Source, ['sourceMethod'])

    expect((Target as any).sourceMethod).toBeUndefined()
  })

  it('should not overwrite existing static members in target', () => {
    class Source {
      static sourceMethod() {
        return 'sourceMethod'
      }
    }

    class Target {
      static sourceMethod() {
        return 'targetMethod'
      }
    }

    inheritStaticMembers(Target, Source)

    expect((Target as any).sourceMethod()).toBe('targetMethod')
  })
})
