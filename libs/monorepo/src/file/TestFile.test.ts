import { describe, expect, it, vi } from 'vitest'

vi.mock('node:fs', () => ({
  default: {
    statSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

vi.mock('@mono/path', () => ({
  default: {
    normalize: vi.fn((p: string) => p),
    hasExtname: vi.fn(),
    parse: vi.fn(),
    hasParentDirname: vi.fn(),
  },
  hasParentDirname: vi.fn(),
}))

import { TestFile } from './TestFile'

describe(TestFile.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(TestFile.inspector).toBeDefined()
    })
  })
})
