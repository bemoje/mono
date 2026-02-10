import { describe, expect, it, vi } from 'vitest'
import fs from 'node:fs'

vi.mock('node:fs', () => ({
  default: {
    statSync: vi.fn(),
    existsSync: vi.fn().mockReturnValue(true),
    readFileSync: vi.fn().mockReturnValue('const a = 1'),
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

function createTestFile(filepath = '/workspace/src/file.test.ts') {
  return new TestFile({} as any, filepath)
}

describe(TestFile.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(TestFile.inspector).toBeDefined()
    })
  })

  describe('tsCode', () => {
    it('should return a TsCode instance', () => {
      const file = createTestFile()
      const tsCode = file.tsCode
      expect(tsCode).toBeDefined()
      expect(tsCode.code).toBe('const a = 1')
    })
  })

  describe('dependencies', () => {
    it('should return empty array when no imports exist', () => {
      vi.mocked(fs.readFileSync).mockReturnValueOnce('const a = 1')
      const file = createTestFile()
      expect(file.dependencies).toEqual([])
    })
  })
})
