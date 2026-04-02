import { describe } from 'vitest'
import { expect } from 'vitest'
import { getRootPackageJson } from './getRootPackageJson'
import { getRootPackageJsonPath } from './getRootPackageJsonPath'
import { it } from 'vitest'

describe(getRootPackageJsonPath.name, () => {
  it('should return a path ending with package.json', () => {
    const result = getRootPackageJsonPath()
    expect(result).toMatch(/package\.json$/)
  })

  it('should return a path containing the repo root', () => {
    const result = getRootPackageJsonPath()
    expect(result).toContain('mono')
  })

  it('should return a normalized path with forward slashes', () => {
    const result = getRootPackageJsonPath()
    expect(result).not.toContain('\\')
  })
})

describe(getRootPackageJson.name, () => {
  it('should return a valid package.json object', async () => {
    const pkg = await getRootPackageJson()
    expect(pkg).toBeDefined()
    expect(typeof pkg).toBe('object')
  })

  it('should have a name property', async () => {
    const pkg = await getRootPackageJson()
    expect(pkg.name).toBeDefined()
    expect(typeof pkg.name).toBe('string')
  })

  it('should have workspaces defined', async () => {
    const pkg = await getRootPackageJson()
    expect(pkg.workspaces).toBeDefined()
    expect(Array.isArray(pkg.workspaces)).toBe(true)
    expect(pkg.workspaces.length).toBeGreaterThan(0)
  })
})
