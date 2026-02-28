import { describe } from 'vitest'
import { expect } from 'vitest'
import { getAllWorkspacePackageJsonPaths } from './getAllWorkspacePackageJsonPaths'
import { it } from 'vitest'

describe(getAllWorkspacePackageJsonPaths.name, () => {
  it('should return an array of package.json paths', async () => {
    const result = await getAllWorkspacePackageJsonPaths()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return paths ending with package.json', async () => {
    const result = await getAllWorkspacePackageJsonPaths()
    for (const p of result) {
      expect(p).toMatch(/package\.json$/)
    }
  })
})
