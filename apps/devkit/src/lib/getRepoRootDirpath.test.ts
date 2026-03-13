import { describe } from 'vitest'
import { expect } from 'vitest'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import { it } from 'vitest'

describe(getRepoRootDirpath.name, () => {
  it('should return a string', () => {
    const result = getRepoRootDirpath()
    expect(typeof result).toBe('string')
  })

  it('should return a path ending with /mono', () => {
    const result = getRepoRootDirpath()
    expect(result).toMatch(/\/mono$/)
  })

  it('should return a normalized path with forward slashes', () => {
    const result = getRepoRootDirpath()
    expect(result).not.toContain('\\')
  })

  it('should return a consistent (cached) value on repeated calls', () => {
    const first = getRepoRootDirpath()
    const second = getRepoRootDirpath()
    expect(first).toBe(second)
  })
})
