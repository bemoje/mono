import { describe } from 'vitest'
import { expect } from 'vitest'
import { getAllWorkspacePackageJsons } from './getAllWorkspacePackageJsons'
import { it } from 'vitest'

describe(getAllWorkspacePackageJsons.name, () => {
  it('should return an array of package.json objects', async () => {
    const result = await getAllWorkspacePackageJsons()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return objects with a name property', async () => {
    const result = await getAllWorkspacePackageJsons()
    for (const pkg of result) {
      expect(pkg.name).toBeDefined()
      expect(typeof pkg.name).toBe('string')
    }
  })
})
