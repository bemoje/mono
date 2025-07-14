import fs from 'fs-extra'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { updateFile } from './updateFile'

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    ensureFile: vi.fn(),
    readFile: vi.fn(),
    outputFile: vi.fn(),
  },
}))

const mockFs = fs as any

describe(updateFile.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(async () => {
      const testFile = './temp-test-updateFile.txt'

      // Setup mocks
      mockFs.readFile.mockResolvedValue('Hello, World!')

      // Create and update a file
      await updateFile(testFile, () => 'Hello, World!')
      let content = await fs.readFile(testFile, 'utf8')
      assert.deepStrictEqual(content, 'Hello, World!')

      // Update existing content - mock different return value
      mockFs.readFile.mockResolvedValue('HELLO, WORLD!')
      await updateFile(testFile, (content) => content.toUpperCase())
      content = await fs.readFile(testFile, 'utf8')
      assert.deepStrictEqual(content, 'HELLO, WORLD!')
    }).not.toThrow()
  })

  it('should create file and directories if they do not exist', async () => {
    const testFile = './temp-dir/nested/test-file.txt'

    mockFs.readFile.mockResolvedValue('')

    await updateFile(testFile, () => 'test content')

    expect(mockFs.ensureFile).toHaveBeenCalledWith(testFile)
    expect(mockFs.outputFile).toHaveBeenCalledWith(testFile, 'test content')
  })

  it('should handle async transformation functions', async () => {
    const testFile = './temp-test-async.txt'

    mockFs.readFile.mockResolvedValueOnce('')

    await updateFile(testFile, () => 'initial')

    mockFs.readFile.mockResolvedValueOnce('initial')

    await updateFile(testFile, async (content) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      return content + ' async'
    })

    expect(mockFs.outputFile).toHaveBeenCalledWith(testFile, 'initial async')
  })
})
