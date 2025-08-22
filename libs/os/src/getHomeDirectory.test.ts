import { describe, expect, it } from 'vitest'
import { getHomeDirectory } from './getHomeDirectory'

describe.sequential(getHomeDirectory.name, () => {
  it('gets the os home directory', () => {
    expect(typeof getHomeDirectory()).toBe('string')
  })
})
