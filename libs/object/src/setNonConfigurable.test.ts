import { describe, expect, it } from 'vitest'

import { setNonConfigurable } from './setNonConfigurable'

describe('setNonConfigurable', () => {
  it('should set the configurable property to true.', () => {
    const o = { a: 1 }
    setNonConfigurable(o, 'a')
    expect(() => {
      Object.defineProperty(o, 'a', { enumerable: false })
    }).toThrowError()
  })
})
