import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@mono/monorepo', () => ({
  MonoRepo: vi.fn(() => ({})),
  getAllImports: vi.fn(() => [
    {
      parent: { parent: { path: '/repo/libs/test' } },
      module: { from: './helper' },
      split: () => [{ from: './helper' }],
    },
    {
      parent: { parent: { path: '/repo/libs/test' } },
      module: { from: './helper' },
      split: () => [{ from: './helper' }],
    },
    {
      parent: { parent: { path: '/repo/libs/test' } },
      module: { from: './other' },
      split: () => [{ from: './other' }],
    },
  ]),
  resolveModuleImportPath: vi.fn((wsPath: string, from: string) => {
    if (from === './helper') return { resolvedFileName: '/repo/libs/test/src/helper.ts' }
    if (from === './other') return { resolvedFileName: '/repo/libs/test/src/other.ts' }
    return undefined
  }),
}))

vi.mock('@mono/map', () => {
  class MockExtMap extends Map {
    sortByValues(fn: (a: number, b: number) => number) {
      const sorted = [...this.entries()].sort((a, b) => fn(a[1], b[1]))
      this.clear()
      for (const [k, v] of sorted) this.set(k, v)
      return this
    }
    reverse() {
      const entries = [...this.entries()].reverse()
      this.clear()
      for (const [k, v] of entries) this.set(k, v)
      return this
    }
    entriesArray() {
      return [...this.entries()]
    }
  }
  return { ExtMap: MockExtMap }
})

import { mostImportedFiles } from './mostImportedFiles'

describe(mostImportedFiles.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a Command named "mostImportedFiles"', () => {
    const cmd = mostImportedFiles()
    expect(cmd.name()).toBe('mostImportedFiles')
  })

  it('should have alias "mif"', () => {
    const cmd = mostImportedFiles()
    expect(cmd.aliases()).toContain('mif')
  })

  it('should log import results when action is invoked', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const cmd = mostImportedFiles()
    cmd.parse([], { from: 'user' })
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
