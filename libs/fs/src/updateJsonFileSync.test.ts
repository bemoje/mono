import fs from 'fs-extra'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { updateJsonFileSync } from './updateJsonFileSync'

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    readJsonSync: vi.fn(),
    outputJsonSync: vi.fn(),
  },
}))

const mockFs = fs as any

describe(updateJsonFileSync.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      const testFile = './temp-test-updateJsonFileSync.json'

      // Setup mocks
      mockFs.readJsonSync.mockImplementationOnce(() => {
        throw new Error('File not found')
      })
      mockFs.readJsonSync.mockReturnValue({ name: 'test', value: 42 })

      // Create JSON file
      const result1 = updateJsonFileSync(testFile, () => ({ name: 'test', value: 42 }))
      assert.deepStrictEqual(result1, { name: 'test', value: 42 })

      // Update existing JSON
      const result2 = updateJsonFileSync(testFile, (data: any) => ({ ...data, updated: true }))
      assert.deepStrictEqual(result2, { name: 'test', value: 42, updated: true })

      // Verify file content
      mockFs.readJsonSync.mockReturnValue({ name: 'test', value: 42, updated: true })
      const fileContent = fs.readJsonSync(testFile)
      assert.deepStrictEqual(fileContent, { name: 'test', value: 42, updated: true })
    }).not.toThrow()
  })

  it('should use default value when file does not exist', () => {
    const testFile = './temp-test-default-sync.json'
    const defaultValue = { default: true, count: 0 }

    mockFs.readJsonSync.mockImplementation(() => {
      throw new Error('File not found')
    })

    const result = updateJsonFileSync(testFile, (data) => ({ ...data, count: data.count + 1 }), defaultValue)

    expect(result).toEqual({ default: true, count: 1 })
    expect(mockFs.outputJsonSync).toHaveBeenCalledWith(testFile, { default: true, count: 1 })
  })

  it('should handle malformed JSON files', () => {
    const testFile = './temp-test-malformed-sync.json'

    const defaultValue = { recovered: true }
    mockFs.readJsonSync.mockImplementation(() => {
      throw new Error('Invalid JSON')
    })

    const result = updateJsonFileSync(testFile, (data) => ({ ...data, fixed: true }), defaultValue)

    expect(result).toEqual({ recovered: true, fixed: true })
    expect(mockFs.outputJsonSync).toHaveBeenCalledWith(testFile, { recovered: true, fixed: true })
  })

  it('should handle complex transformations', () => {
    const testFile = './temp-test-complex.json'

    mockFs.readJsonSync.mockImplementation(() => {
      throw new Error('File not found')
    })

    const result = updateJsonFileSync(
      testFile,
      (data) => ({
        ...data,
        timestamp: Date.now(),
        items: ['a', 'b', 'c'],
        nested: { deep: { value: 123 } },
      }),
      { version: 1 },
    )

    expect(result).toMatchObject({
      version: 1,
      items: ['a', 'b', 'c'],
      nested: { deep: { value: 123 } },
    })
    expect(typeof result.timestamp).toBe('number')
    expect(mockFs.outputJsonSync).toHaveBeenCalledWith(testFile, result)
  })
})
