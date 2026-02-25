import { TsFile } from '../index'
import { describe } from 'vitest'
import { expect } from 'vitest'
import fs from 'node:fs'
import { it } from 'vitest'
import { vi } from 'vitest'

vi.mock('node:fs', () => {
  return {
    default: {
      statSync: vi.fn(),
      existsSync: vi.fn().mockReturnValue(true),
      readFileSync: vi.fn().mockReturnValue('const a = 1'),
    },
  }
})
vi.mock('@mono/path', () => {
  return {
    default: {
      normalize: vi.fn((p: string) => {
        return p
      }),
      hasExtname: vi.fn(),
      parse: vi.fn(),
      hasParentDirname: vi.fn(),
    },
    hasParentDirname: vi.fn(),
  }
})

function createTsFile(filepath = '/workspace/src/file.ts') {
  return new TsFile({} as any, filepath)
}

describe.sequential(TsFile.name, () => {
  describe.sequential('inspector', () => {
    it('should be defined as a static property', () => {
      expect(TsFile.inspector).toBeDefined()
    })
  })

  describe.sequential('tsCode', () => {
    it('should return a TsCode instance', () => {
      const file = createTsFile()
      const tsCode = file.tsCode
      expect(tsCode).toBeDefined()
      expect(tsCode.code).toBe('const a = 1')
    })
  })

  describe.sequential('dependencies', () => {
    it('should return empty array when no imports exist', () => {
      vi.mocked(fs.readFileSync).mockReturnValueOnce('const a = 1')
      const file = createTsFile()
      expect(file.dependencies).toEqual([])
    })
  })
})
