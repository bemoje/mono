import fs from 'fs-extra'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { updateJsonFile } from './updateJsonFile'

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    readJson: vi.fn(),
    outputJson: vi.fn(),
  },
}))

const mockFs = fs as any

describe(updateJsonFile.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(async () => {
      const testFile = './temp-test-updateJsonFile.json'

      // Setup mocks
      mockFs.readJson.mockRejectedValueOnce(new Error('File not found'))
      mockFs.readJson.mockResolvedValue({ name: 'test', value: 42 })

      // Create JSON file
      const result1 = await updateJsonFile(testFile, () => ({ name: 'test', value: 42 }))
      assert.deepStrictEqual(result1, { name: 'test', value: 42 })

      // Update existing JSON
      const result2 = await updateJsonFile(testFile, (data: any) => ({ ...data, updated: true }))
      assert.deepStrictEqual(result2, { name: 'test', value: 42, updated: true })

      // Verify file content
      mockFs.readJson.mockResolvedValue({ name: 'test', value: 42, updated: true })
      const fileContent = await fs.readJson(testFile)
      assert.deepStrictEqual(fileContent, { name: 'test', value: 42, updated: true })
    }).not.toThrow()
  })

  it('should use default value when file does not exist', async () => {
    const testFile = './temp-test-default.json'
    const defaultValue = { default: true, count: 0 }

    mockFs.readJson.mockRejectedValue(new Error('File not found'))

    const result = await updateJsonFile(testFile, (data) => ({ ...data, count: data.count + 1 }), defaultValue)

    expect(result).toEqual({ default: true, count: 1 })
    expect(mockFs.outputJson).toHaveBeenCalledWith(testFile, { default: true, count: 1 })
  })

  it('should handle malformed JSON files', async () => {
    const testFile = './temp-test-malformed.json'

    const defaultValue = { recovered: true }
    mockFs.readJson.mockRejectedValue(new Error('Invalid JSON'))

    const result = await updateJsonFile(testFile, (data) => ({ ...data, fixed: true }), defaultValue)

    expect(result).toEqual({ recovered: true, fixed: true })
    expect(mockFs.outputJson).toHaveBeenCalledWith(testFile, { recovered: true, fixed: true })
  })

  it('should handle async transformation functions', async () => {
    const testFile = './temp-test-async-json.json'

    mockFs.readJson.mockRejectedValue(new Error('File not found'))

    const result = await updateJsonFile(
      testFile,
      async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return { ...data, async: true }
      },
      { initial: true },
    )

    expect(result).toEqual({ initial: true, async: true })
    expect(mockFs.outputJson).toHaveBeenCalledWith(testFile, { initial: true, async: true })
  })
})
