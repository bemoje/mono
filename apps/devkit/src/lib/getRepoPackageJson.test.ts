import { describe } from 'vitest'
import { expect } from 'vitest'
import { getRepoPackageJson } from './getRepoPackageJson'
import { getRepoPackageJsonPath } from './getRepoPackageJson'
import { it } from 'vitest'

describe(getRepoPackageJsonPath.name, () => {
  it('should return a path ending with package.json', () => {
    const result = getRepoPackageJsonPath()
    expect(result).toMatch(/package\.json$/)
  })

  it('should return a path containing the repo root', () => {
    const result = getRepoPackageJsonPath()
    expect(result).toContain('mono')
  })

  it('should return a normalized path with forward slashes', () => {
    const result = getRepoPackageJsonPath()
    expect(result).not.toContain('\\')
  })
})

describe(getRepoPackageJson.name, () => {
  it('should return a valid package.json object', async () => {
    const pkg = await getRepoPackageJson()
    expect(pkg).toBeDefined()
    expect(typeof pkg).toBe('object')
  })

  it('should have a name property', async () => {
    const pkg = await getRepoPackageJson()
    expect(pkg.name).toBeDefined()
    expect(typeof pkg.name).toBe('string')
  })

  it('should have workspaces defined', async () => {
    const pkg = await getRepoPackageJson()
    expect(pkg.workspaces).toBeDefined()
    expect(Array.isArray(pkg.workspaces)).toBe(true)
    expect(pkg.workspaces.length).toBeGreaterThan(0)
  })
})
