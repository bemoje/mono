import fs from 'fs-extra'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { updateFileSync } from './updateFileSync'

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    ensureFileSync: vi.fn(),
    readFileSync: vi.fn(),
    outputFileSync: vi.fn(),
  },
}))

const mockFs = fs as any

describe(updateFileSync.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      const testFile = './temp-test-updateFileSync.txt'

      // Setup mocks
      mockFs.readFileSync.mockReturnValue('Hello, World!')

      // Create and update a file
      updateFileSync(testFile, () => 'Hello, World!')
      let content = fs.readFileSync(testFile, 'utf8')
      assert.deepStrictEqual(content, 'Hello, World!')

      // Update existing content
      mockFs.readFileSync.mockReturnValue('HELLO, WORLD!')
      updateFileSync(testFile, (content) => content.toUpperCase())
      content = fs.readFileSync(testFile, 'utf8')
      assert.deepStrictEqual(content, 'HELLO, WORLD!')
    }).not.toThrow()
  })

  it('should create file and directories if they do not exist', () => {
    const testFile = './temp-dir-sync/nested/test-file.txt'

    mockFs.readFileSync.mockReturnValue('')

    updateFileSync(testFile, () => 'test content')

    expect(mockFs.ensureFileSync).toHaveBeenCalledWith(testFile)
    expect(mockFs.outputFileSync).toHaveBeenCalledWith(testFile, 'test content')
  })

  it('should update existing file content', () => {
    const testFile = './temp-test-update.txt'

    mockFs.readFileSync.mockReturnValueOnce('')
    mockFs.readFileSync.mockReturnValueOnce('original')

    updateFileSync(testFile, () => 'original')
    updateFileSync(testFile, (content) => content + ' updated')

    expect(mockFs.outputFileSync).toHaveBeenCalledWith(testFile, 'original updated')
  })
})
