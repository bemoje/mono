import { describe, it, expect } from 'vitest'
import { dirnameDeep } from './dirnameDeep'

describe(dirnameDeep.name, () => {
  it('should return the immediate parent directory', () => {
    expect(dirnameDeep('a/b/c/d')).toBe('a/b/c')
  })

  it('should return the parent directory with a depth of 2', () => {
    expect(dirnameDeep('a/b/c/d', 2)).toBe('a/b')
  })

  it('should handle paths with only one level', () => {
    expect(dirnameDeep('a')).toBe('.')
  })

  it('should handle root paths gracefully', () => {
    expect(dirnameDeep('/')).toBe('/')
  })

  it('should handle paths with a depth greater than available levels', () => {
    expect(dirnameDeep('a/b/c/d', 10)).toBe('.')
  })

  it('should return the immediate parent if depth is 1', () => {
    expect(dirnameDeep('a/b/c/d', 1)).toBe('a/b/c')
  })

  it('should handle empty strings gracefully', () => {
    expect(dirnameDeep('')).toBe('.')
  })

  it('should handle undefined depth as 1', () => {
    expect(dirnameDeep('a/b/c')).toBe('a/b')
  })
})
