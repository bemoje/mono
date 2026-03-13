import assert from 'assert'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import fs from 'fs-extra'
import { it } from 'vitest'
import { updateFileSync } from './updateFileSync'
import { vi } from 'vitest'

// Mock fs-extra
vi.mock('fs-extra', () => {
  return { default: { ensureFileSync: vi.fn(), readFileSync: vi.fn(), outputFileSync: vi.fn() } }
})

const mockFs = fs as any

describe(updateFileSync.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      const testFile = './.temp/test/updateFileSync.txt'

      // Setup mocks
      mockFs.readFileSync.mockReturnValue('Hello, World!')

      // Create and update a file
      updateFileSync(testFile, () => {
        return 'Hello, World!'
      })
      let content = fs.readFileSync(testFile, 'utf8')
      assert.deepStrictEqual(content, 'Hello, World!')

      // Update existing content
      mockFs.readFileSync.mockReturnValue('HELLO, WORLD!')
      updateFileSync(testFile, (content) => {
        return content.toUpperCase()
      })
      content = fs.readFileSync(testFile, 'utf8')
      assert.deepStrictEqual(content, 'HELLO, WORLD!')
    }).not.toThrow()
  })

  it('should create file and directories if they do not exist', () => {
    const testFile = './.temp/test/dir-sync/nested/test-file.txt'

    mockFs.readFileSync.mockReturnValue('')

    updateFileSync(testFile, () => {
      return 'test content'
    })

    expect(mockFs.ensureFileSync).toHaveBeenCalledWith(testFile)
    expect(mockFs.outputFileSync).toHaveBeenCalledWith(testFile, 'test content')
  })

  it('should update existing file content', () => {
    const testFile = './.temp/test/update.txt'

    mockFs.readFileSync.mockReturnValueOnce('')
    mockFs.readFileSync.mockReturnValueOnce('original')

    updateFileSync(testFile, () => {
      return 'original'
    })
    updateFileSync(testFile, (content) => {
      return `${content} updated`
    })

    expect(mockFs.outputFileSync).toHaveBeenCalledWith(testFile, 'original updated')
  })
})
