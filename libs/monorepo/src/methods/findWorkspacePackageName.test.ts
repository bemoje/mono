import { describe } from 'vitest'
import { expect } from 'vitest'
import { findWorkspacePackageName } from './findWorkspacePackageName'
import { it } from 'vitest'

describe(findWorkspacePackageName.name, () => {
  it('should find a package by its full name', async () => {
    const result = await findWorkspacePackageName('@mono/array')
    expect(result).toBe('@mono/array')
  })

  it('should find a package by its short name', async () => {
    const result = await findWorkspacePackageName('array')
    expect(result).toBe('@mono/array')
  })

  it('should return undefined for a non-existent package', async () => {
    const result = await findWorkspacePackageName('nonexistent-package-xyz')
    expect(result).toBeUndefined()
  })
})
