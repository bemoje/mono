import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { Stats } from 'fs-extra'

// Mock walkdir
vi.mock('walkdir', () => ({
  default: {
    sync: vi.fn(),
  },
}))

// Mock upath
vi.mock('upath', () => ({
  default: {
    normalizeSafe: vi.fn((p: string) => p.replace(/\\/g, '/')),
    basename: vi.fn((p: string) => p.split('/').pop() || ''),
  },
}))

import { walkDirectory } from './walkDirectory'
import walkdir from 'walkdir'

const mockSync = walkdir.sync as any

describe(walkDirectory.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      // Mock basic directory walk
      mockSync.mockReturnValue(['/test/file1.txt', '/test/file2.txt'])

      const paths = walkDirectory('/test', {})
      assert.strictEqual(Array.isArray(paths), true)
      assert.strictEqual(paths.length, 2)
      assert.strictEqual(typeof paths[0], 'string')
    }).not.toThrow()
  })

  describe('without stats option', () => {
    it('should return array of paths when no stats or only option', () => {
      mockSync.mockReturnValue(['/test/file1.txt', '/test/file2.txt'])

      const result = walkDirectory('/test', {})

      expect(result).toEqual(['/test/file1.txt', '/test/file2.txt'])
      expect(mockSync).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({
          return_object: false,
        }),
      )
    })

    it('should normalize paths', () => {
      mockSync.mockReturnValue(['\\test\\file1.txt', '\\test\\file2.txt'])

      const result = walkDirectory('\\test', {})

      expect(result).toEqual(['/test/file1.txt', '/test/file2.txt'])
    })
  })

  describe('with stats option', () => {
    const mockFileStats = { isFile: () => true, isDirectory: () => false } as Stats
    const mockDirStats = { isFile: () => false, isDirectory: () => true } as Stats

    it('should return array of [path, stats] tuples when stats is true', () => {
      mockSync.mockReturnValue({
        '/test/file1.txt': mockFileStats,
        '/test/dir1': mockDirStats,
      })

      const result = walkDirectory('/test', { stats: true })

      expect(result).toEqual([
        ['/test/file1.txt', mockFileStats],
        ['/test/dir1', mockDirStats],
      ])
      expect(mockSync).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({
          return_object: true,
        }),
      )
    })
  })

  describe('with only option', () => {
    const mockFileStats = { isFile: () => true, isDirectory: () => false } as Stats
    const mockDirStats = { isFile: () => false, isDirectory: () => true } as Stats

    it('should filter to only files when only="files"', () => {
      mockSync.mockReturnValue({
        '/test/file1.txt': mockFileStats,
        '/test/dir1': mockDirStats,
        '/test/file2.txt': mockFileStats,
      })

      const result = walkDirectory('/test', { only: 'files' })

      expect(result).toEqual(['/test/file1.txt', '/test/file2.txt'])
    })

    it('should filter to only directories when only="directories"', () => {
      mockSync.mockReturnValue({
        '/test/file1.txt': mockFileStats,
        '/test/dir1': mockDirStats,
        '/test/dir2': mockDirStats,
      })

      const result = walkDirectory('/test', { only: 'directories' })

      expect(result).toEqual(['/test/dir1', '/test/dir2'])
    })

    it('should return stats when both only and stats options are used', () => {
      mockSync.mockReturnValue({
        '/test/file1.txt': mockFileStats,
        '/test/dir1': mockDirStats,
      })

      const result = walkDirectory('/test', { only: 'files', stats: true })

      expect(result).toEqual([['/test/file1.txt', mockFileStats]])
    })
  })

  describe('walkdir options conversion', () => {
    it('should convert maxDepth option', () => {
      mockSync.mockReturnValue([])

      walkDirectory('/test', { maxDepth: 2 })

      expect(mockSync).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({
          max_depth: 2,
        }),
      )
    })

    it('should convert followSymlinks option', () => {
      mockSync.mockReturnValue([])

      walkDirectory('/test', { followSymlinks: true })

      expect(mockSync).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({
          follow_symlinks: true,
        }),
      )
    })

    it('should convert ignoreInodes option', () => {
      mockSync.mockReturnValue([])

      walkDirectory('/test', { ignoreInodes: true })

      expect(mockSync).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({
          track_inodes: false,
        }),
      )
    })

    it('should convert filter option', () => {
      mockSync.mockReturnValue([])
      const filterFn = vi.fn(() => true)

      walkDirectory('/test', { filter: filterFn })

      const callArgs = mockSync.mock.calls[0]?.[1] as any
      expect(callArgs?.filter).toBeDefined()

      // Test the converted filter function
      const result = callArgs.filter('/test/subdir', ['file1.txt'])
      expect(filterFn).toHaveBeenCalledWith('/test/subdir', 'subdir')
      expect(result).toEqual(['file1.txt'])
    })

    it('should return empty array when filter returns false', () => {
      mockSync.mockReturnValue([])
      const filterFn = vi.fn(() => false)

      walkDirectory('/test', { filter: filterFn })

      const callArgs = mockSync.mock.calls[0]?.[1] as any
      const result = callArgs.filter('/test/subdir', ['file1.txt'])
      expect(result).toEqual([])
    })
  })

  describe('edge cases', () => {
    it('should handle empty results', () => {
      mockSync.mockReturnValue([])

      const result = walkDirectory('/empty', {})

      expect(result).toEqual([])
    })

    it('should handle empty results with stats', () => {
      mockSync.mockReturnValue({})

      const result = walkDirectory('/empty', { stats: true })

      expect(result).toEqual([])
    })

    it('should handle mixed file types with filtering', () => {
      const mockFileStats = { isFile: () => true, isDirectory: () => false } as Stats
      const mockDirStats = { isFile: () => false, isDirectory: () => true } as Stats

      mockSync.mockReturnValue({
        '/test/file.txt': mockFileStats,
        '/test/dir': mockDirStats,
        '/test/file2.txt': mockFileStats,
      })

      const filesResult = walkDirectory('/test', { only: 'files' })
      const dirsResult = walkDirectory('/test', { only: 'directories' })

      expect(filesResult).toEqual(['/test/file.txt', '/test/file2.txt'])
      expect(dirsResult).toEqual(['/test/dir'])
    })
  })
})
