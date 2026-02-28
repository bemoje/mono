import { describe } from 'vitest'
import { expect } from 'vitest'
import { getAllWorkspacePackageNames } from './getAllWorkspacePackageNames'
import { it } from 'vitest'

describe(getAllWorkspacePackageNames.name, () => {
  it('should return an array of package names', async () => {
    const result = await getAllWorkspacePackageNames()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return strings', async () => {
    const result = await getAllWorkspacePackageNames()
    for (const name of result) {
      expect(typeof name).toBe('string')
    }
  })

  it('should include known package names', async () => {
    const result = await getAllWorkspacePackageNames()
    const hasMonoPackage = result.some((n) => {
      return n.startsWith('@mono/')
    })
    expect(hasMonoPackage).toBe(true)
  })
})
