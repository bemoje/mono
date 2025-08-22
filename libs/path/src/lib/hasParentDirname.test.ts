import { describe, it, expect } from 'vitest'
import assert from 'node:assert'
import { hasParentDirname } from './hasParentDirname'

describe(hasParentDirname.name, () => {
  it('examples', () => {
    expect(() => {
      // Check if a path has a parent directory with a specific name
      assert.deepStrictEqual(
        hasParentDirname('src/components/Button.tsx', 'components'),
        true,
        'should find components parent',
      )
      assert.deepStrictEqual(hasParentDirname('src/utils/helpers.ts', 'src'), true, 'should find src parent')
      assert.deepStrictEqual(
        hasParentDirname('project/src/index.ts', 'project'),
        true,
        'should find project parent',
      )
      assert.deepStrictEqual(hasParentDirname('file.ts', 'src'), false, 'should not find non-existent parent')
    }).not.toThrow()
  })

  describe('Unix-style paths', () => {
    it('should return true when path contains the parent directory name', () => {
      expect(hasParentDirname('src/components/Button.tsx', 'components')).toBe(true)
      expect(hasParentDirname('src/utils/helpers.ts', 'src')).toBe(true)
      expect(hasParentDirname('project/src/index.ts', 'project')).toBe(true)
      expect(hasParentDirname('a/b/c/d/file.txt', 'b')).toBe(true)
    })

    it('should return false when path does not contain the parent directory name', () => {
      expect(hasParentDirname('src/components/Button.tsx', 'utils')).toBe(false)
      expect(hasParentDirname('file.ts', 'src')).toBe(false)
      expect(hasParentDirname('project/index.ts', 'components')).toBe(false)
    })

    it('should handle paths starting with the directory name', () => {
      expect(hasParentDirname('src/index.ts', 'src')).toBe(true)
      expect(hasParentDirname('components/Button.tsx', 'components')).toBe(true)
    })
  })

  describe('Windows-style paths', () => {
    it('should return true when path contains the parent directory name', () => {
      expect(hasParentDirname('src\\components\\Button.tsx', 'components')).toBe(true)
      expect(hasParentDirname('src\\utils\\helpers.ts', 'src')).toBe(true)
      expect(hasParentDirname('project\\src\\index.ts', 'project')).toBe(true)
    })

    it('should return false when path does not contain the parent directory name', () => {
      expect(hasParentDirname('src\\components\\Button.tsx', 'utils')).toBe(false)
      expect(hasParentDirname('file.ts', 'src')).toBe(false)
    })
  })

  describe('Mixed path separators', () => {
    it('should handle mixed forward and backslashes', () => {
      expect(hasParentDirname('src/components\\Button.tsx', 'components')).toBe(true)
      expect(hasParentDirname('src\\utils/helpers.ts', 'utils')).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      expect(hasParentDirname('', 'src')).toBe(false)
      expect(hasParentDirname('src/file.ts', '')).toBe(false)
    })

    it('should be case sensitive', () => {
      expect(hasParentDirname('src/components/Button.tsx', 'Components')).toBe(false)
      expect(hasParentDirname('SRC/file.ts', 'src')).toBe(false)
    })

    it('should not match partial directory names', () => {
      expect(hasParentDirname('source/file.ts', 'src')).toBe(false)
      expect(hasParentDirname('src-backup/file.ts', 'src')).toBe(false)
    })
  })
})
