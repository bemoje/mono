import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { relativeImportPath } from './relativeImportPath'

describe(relativeImportPath.name, () => {
  it('should return relative path from file to file', () => {
    const result = relativeImportPath('/repo/src/a.ts', '/repo/src/b.ts')
    expect(result).toBe('./b')
  })

  it('should return relative path from directory to file', () => {
    const result = relativeImportPath('/repo/src', '/repo/src/utils/helper.ts')
    expect(result).toBe('./utils/helper')
  })

  it('should strip .ts extension', () => {
    const result = relativeImportPath('/repo/src/a.ts', '/repo/src/b.ts')
    expect(result).not.toContain('.ts')
  })

  it('should strip .tsx extension', () => {
    const result = relativeImportPath('/repo/src/a.ts', '/repo/src/b.tsx')
    expect(result).not.toContain('.tsx')
  })

  it('should strip .mts extension', () => {
    const result = relativeImportPath('/repo/src/a.ts', '/repo/src/b.mts')
    expect(result).not.toContain('.mts')
  })

  it('should strip /index from import path', () => {
    const result = relativeImportPath('/repo/src/a.ts', '/repo/src/utils/index.ts')
    expect(result).toBe('./utils')
  })

  it('should handle sibling directories', () => {
    const result = relativeImportPath('/repo/src/foo/a.ts', '/repo/src/bar/b.ts')
    expect(result).toBe('../bar/b')
  })

  it('should prefix with ./ when result is not already relative', () => {
    const result = relativeImportPath('/repo/src', '/repo/src/same.ts')
    expect(result).toMatch(/^\.\//)
  })
})
