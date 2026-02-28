import { describe } from 'vitest'
import { expect } from 'vitest'
import { getAllWorkspacePaths } from './getAllWorkspacePaths'
import { it } from 'vitest'

describe(getAllWorkspacePaths.name, () => {
  it('should return an array of workspace paths', async () => {
    const result = await getAllWorkspacePaths()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return normalized paths with forward slashes', async () => {
    const result = await getAllWorkspacePaths()
    for (const p of result) {
      expect(p).not.toContain('\\')
    }
  })

  it('should include known workspace directories', async () => {
    const result = await getAllWorkspacePaths()
    const hasLibs = result.some((p) => {
      return p.includes('libs/')
    })
    expect(hasLibs).toBe(true)
  })
})
