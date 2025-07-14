import fs from 'fs-extra'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { updateFileLinesSync } from './updateFileLinesSync'

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    ensureFileSync: vi.fn(),
    readFileSync: vi.fn(),
    outputFileSync: vi.fn(),
  },
}))

const mockFs = fs as any

describe(updateFileLinesSync.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      const testFile = './temp-test-updateFileLinesSync.txt'

      // Setup mocks
      mockFs.readFileSync.mockReturnValueOnce('')
      mockFs.readFileSync.mockReturnValue('line1\nline2\nline3')

      // Create file with lines
      updateFileLinesSync(testFile, () => ['line1', 'line2', 'line3'])
      let content = fs.readFileSync(testFile, 'utf8')
      assert.deepStrictEqual(content, 'line1\nline2\nline3')

      // Update lines by modifying array
      mockFs.readFileSync.mockReturnValue('LINE1\nLINE2\nLINE3')
      updateFileLinesSync(testFile, (lines) => lines.map((line) => line.toUpperCase()))
      content = fs.readFileSync(testFile, 'utf8')
      assert.deepStrictEqual(content, 'LINE1\nLINE2\nLINE3')

      // Update by returning string
      mockFs.readFileSync.mockReturnValue('single line content')
      updateFileLinesSync(testFile, () => 'single line content')
      content = fs.readFileSync(testFile, 'utf8')
      assert.deepStrictEqual(content, 'single line content')
    }).not.toThrow()
  })

  it('should handle empty files', () => {
    const testFile = './temp-test-empty-sync.txt'

    mockFs.readFileSync.mockReturnValue('')

    updateFileLinesSync(testFile, (lines) => {
      expect(lines).toEqual([''])
      return ['new', 'content']
    })

    expect(mockFs.outputFileSync).toHaveBeenCalledWith(testFile, 'new\ncontent')
  })

  it('should filter and transform lines', () => {
    const testFile = './temp-test-filter.txt'

    mockFs.readFileSync.mockReturnValueOnce('')
    mockFs.readFileSync.mockReturnValueOnce('keep\nremove\nkeep\nremove')

    updateFileLinesSync(testFile, () => ['keep', 'remove', 'keep', 'remove'])
    updateFileLinesSync(testFile, (lines) =>
      lines.filter((line) => line === 'keep').map((line) => line.toUpperCase()),
    )

    expect(mockFs.outputFileSync).toHaveBeenCalledWith(testFile, 'KEEP\nKEEP')
  })
})
