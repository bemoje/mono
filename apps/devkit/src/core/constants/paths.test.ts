import { describe, expect, it } from 'vitest'
import {
  repoRootPath,
  repoRootPackageJsonBasename,
  tsconfigBaseJsonBasename,
  tsconfigBasePathsJsonBasename,
  repoRootPackageJsonPath,
  tsconfigBasePathsJsonPath,
} from './paths'

describe('paths', () => {
  it('should export repoRootPath as a string', () => {
    expect(typeof repoRootPath).toBe('string')
    expect(repoRootPath.length).toBeGreaterThan(0)
  })

  it('should export correct basenames', () => {
    expect(repoRootPackageJsonBasename).toBe('package.json')
    expect(tsconfigBaseJsonBasename).toBe('tsconfig.json')
    expect(tsconfigBasePathsJsonBasename).toBe('tsconfig.paths.json')
  })

  it('should export repoRootPackageJsonPath containing the basename', () => {
    expect(repoRootPackageJsonPath).toContain('package.json')
  })

  it('should export tsconfigBasePathsJsonPath containing the basename', () => {
    expect(tsconfigBasePathsJsonPath).toContain('tsconfig.paths.json')
  })
})
