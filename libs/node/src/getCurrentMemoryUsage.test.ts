import { describe } from 'vitest'
import { expect } from 'vitest'
import { getCurrentMemoryUsage } from './getCurrentMemoryUsage'
import { it } from 'vitest'

describe(getCurrentMemoryUsage.name, () => {
  it('should ', () => {
    expect(getCurrentMemoryUsage()).toBeTypeOf('number')
  })
})
