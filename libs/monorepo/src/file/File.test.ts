import { describe, expect, it, vi } from 'vitest'
import { File } from './File'

vi.mock('node:fs', () => ({
  default: {
    statSync: vi.fn().mockReturnValue({ size: 100, isFile: () => true }),
    existsSync: vi.fn().mockReturnValue(true),
    readFileSync: vi.fn().mockReturnValue(''),
  },
}))

vi.mock('@mono/path', () => ({
  default: {
    normalize: vi.fn((p: string) => p),
    hasExtname: vi.fn((p: string, exts: string | string[]) => {
      const ext = p.split('.').pop() ?? ''
      return Array.isArray(exts) ? exts.includes(ext) : ext === exts
    }),
    parse: vi.fn((p: string) => {
      const basename = p.split('/').pop() ?? ''
      const dotIndex = basename.indexOf('.')
      return { name: dotIndex >= 0 ? basename.slice(0, dotIndex) : basename }
    }),
    hasParentDirname: vi.fn((p: string, name: string) => p.includes('/' + name + '/')),
  },
  hasParentDirname: vi.fn((p: string, name: string) => p.includes('/' + name + '/')),
}))

function createFile(filepath: string) {
  return new File({} as any, filepath)
}

describe(File.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(File.inspector).toBeDefined()
    })
  })

  describe('stats', () => {
    it('should return file stats', () => {
      const file = createFile('/workspace/src/myFile.ts')
      const stats = file.stats
      expect(stats).toBeDefined()
      expect(stats.size).toBe(100)
    })
  })

  describe('isTs', () => {
    it('should return true for .ts files', () => {
      expect(createFile('/workspace/src/file.ts').isTs).toBe(true)
    })

    it('should return true for .mts files', () => {
      expect(createFile('/workspace/src/file.mts').isTs).toBe(true)
    })

    it('should return true for .tsx files', () => {
      expect(createFile('/workspace/src/file.tsx').isTs).toBe(true)
    })

    it('should return false for .js files', () => {
      expect(createFile('/workspace/src/file.js').isTs).toBe(false)
    })
  })

  describe('isDotTs', () => {
    it('should return true for .ts files', () => {
      expect(createFile('/workspace/src/file.ts').isDotTs).toBe(true)
    })

    it('should return false for .tsx files', () => {
      expect(createFile('/workspace/src/file.tsx').isDotTs).toBe(false)
    })
  })

  describe('isDotTsx', () => {
    it('should return true for .tsx files', () => {
      expect(createFile('/workspace/src/file.tsx').isDotTsx).toBe(true)
    })

    it('should return false for .ts files', () => {
      expect(createFile('/workspace/src/file.ts').isDotTsx).toBe(false)
    })
  })

  describe('isExample', () => {
    it('should return true for .examples.ts files', () => {
      expect(createFile('/workspace/src/file.examples.ts').isExample).toBe(true)
    })

    it('should return false for regular .ts files', () => {
      expect(createFile('/workspace/src/file.ts').isExample).toBe(false)
    })
  })

  describe('isDeclaration', () => {
    it('should return true for .d.ts files', () => {
      expect(createFile('/workspace/src/file.d.ts').isDeclaration).toBe(true)
    })

    it('should return false for regular .ts files', () => {
      expect(createFile('/workspace/src/file.ts').isDeclaration).toBe(false)
    })
  })

  describe('isTest', () => {
    it('should return true for .test.ts files', () => {
      expect(createFile('/workspace/src/file.test.ts').isTest).toBe(true)
    })

    it('should return false for regular .ts files', () => {
      expect(createFile('/workspace/src/file.ts').isTest).toBe(false)
    })
  })

  describe('isIndexFile', () => {
    it('should return true for index.ts', () => {
      expect(createFile('/workspace/src/index.ts').isIndexFile).toBe(true)
    })

    it('should return false for other filenames', () => {
      expect(createFile('/workspace/src/file.ts').isIndexFile).toBe(false)
    })
  })
})
