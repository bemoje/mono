import { describe } from 'vitest'
import { expect } from 'vitest'
import { getRootPackageJson } from './getRootPackageJson'
import { it } from 'vitest'

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
