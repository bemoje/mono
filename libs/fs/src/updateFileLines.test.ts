import fs from 'fs-extra'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { updateFileLines } from './updateFileLines'

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    ensureFile: vi.fn(),
    readFile: vi.fn(),
    outputFile: vi.fn(),
  },
}))

const mockFs = fs as any

describe(updateFileLines.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(async () => {
      const testFile = './temp-test-updateFileLines.txt'

      // Setup mocks for different calls
      mockFs.readFile.mockResolvedValueOnce('')
      mockFs.readFile.mockResolvedValue('line1\nline2\nline3')

      // Create file with lines
      await updateFileLines(testFile, () => ['line1', 'line2', 'line3'])
      let content = await fs.readFile(testFile, 'utf8')
      assert.deepStrictEqual(content, 'line1\nline2\nline3')

      // Update lines by modifying array
      mockFs.readFile.mockResolvedValue('LINE1\nLINE2\nLINE3')
      await updateFileLines(testFile, (lines) => lines.map((line) => line.toUpperCase()))
      content = await fs.readFile(testFile, 'utf8')
      assert.deepStrictEqual(content, 'LINE1\nLINE2\nLINE3')

      // Update by returning string
      mockFs.readFile.mockResolvedValue('single line content')
      await updateFileLines(testFile, () => 'single line content')
      content = await fs.readFile(testFile, 'utf8')
      assert.deepStrictEqual(content, 'single line content')
    }).not.toThrow()
  })

  it('should handle empty files', async () => {
    const testFile = './temp-test-empty.txt'

    mockFs.readFile.mockResolvedValue('')

    await updateFileLines(testFile, (lines) => {
      expect(lines).toEqual([''])
      return ['new', 'content']
    })

    expect(mockFs.outputFile).toHaveBeenCalledWith(testFile, 'new\ncontent')
  })

  it('should preserve line endings and handle both return types', async () => {
    const testFile = './temp-test-mixed.txt'

    // Test array return
    mockFs.readFile.mockResolvedValueOnce('')
    await updateFileLines(testFile, () => ['a', 'b', 'c'])
    expect(mockFs.outputFile).toHaveBeenCalledWith(testFile, 'a\nb\nc')

    // Test string return
    mockFs.readFile.mockResolvedValueOnce('')
    await updateFileLines(testFile, () => 'x\ny\nz')
    expect(mockFs.outputFile).toHaveBeenCalledWith(testFile, 'x\ny\nz')
  })
})
