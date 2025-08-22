import { describe, expect, it } from 'vitest'
import { getCurrentMemoryUsage } from './getCurrentMemoryUsage'

describe(getCurrentMemoryUsage.name, () => {
  it('should ', () => {
    expect(getCurrentMemoryUsage()).toBeTypeOf('number')
  })
})
