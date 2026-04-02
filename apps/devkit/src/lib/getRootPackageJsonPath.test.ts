import { describe } from 'vitest'
import { expect } from 'vitest'
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
