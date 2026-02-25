import assert from 'node:assert'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import fs from 'fs-extra'
import { it } from 'vitest'
import { updateFile } from './updateFile'
import { vi } from 'vitest'

// Mock fs-extra
vi.mock('fs-extra', () => {
  return {
    default: {
      ensureFile: vi.fn(),
      readFile: vi.fn(),
      outputFile: vi.fn(),
    },
  }
})

const mockFs = fs as any

describe(updateFile.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(async () => {
      const testFile = './.temp/test/updateFile.txt'

      // Setup mocks
      mockFs.readFile.mockResolvedValue('Hello, World!')

      // Create and update a file
      await updateFile(testFile, () => {
        return 'Hello, World!'
      })
      let content = await fs.readFile(testFile, 'utf8')
      assert.deepStrictEqual(content, 'Hello, World!')

      // Update existing content - mock different return value
      mockFs.readFile.mockResolvedValue('HELLO, WORLD!')
      await updateFile(testFile, (content) => {
        return content.toUpperCase()
      })
      content = await fs.readFile(testFile, 'utf8')
      assert.deepStrictEqual(content, 'HELLO, WORLD!')
    }).not.toThrow()
  })

  it('should create file and directories if they do not exist', async () => {
    const testFile = './.temp/test/dir/nested/test-file.txt'

    mockFs.readFile.mockResolvedValue('')

    await updateFile(testFile, () => {
      return 'test content'
    })

    expect(mockFs.ensureFile).toHaveBeenCalledWith(testFile)
    expect(mockFs.outputFile).toHaveBeenCalledWith(testFile, 'test content')
  })

  it('should handle async transformation functions', async () => {
    const testFile = './.temp/test/async.txt'

    mockFs.readFile.mockResolvedValueOnce('')

    await updateFile(testFile, () => {
      return 'initial'
    })

    mockFs.readFile.mockResolvedValueOnce('initial')

    await updateFile(testFile, async (content) => {
      await new Promise((resolve) => {
        return setTimeout(resolve, 10)
      })
      return `${content} async`
    })

    expect(mockFs.outputFile).toHaveBeenCalledWith(testFile, 'initial async')
  })
})
