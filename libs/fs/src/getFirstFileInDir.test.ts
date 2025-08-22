import { describe, it, expect, vi } from 'vitest'
import fs from 'fs-extra'
import { getFirstFileInDir } from './getFirstFileInDir'

vi.mock('fs-extra')

describe(getFirstFileInDir.name, () => {
  it('should return the first file in a directory', async () => {
    const mockDirents = [
      { name: 'file1.txt', isFile: () => true },
      { name: 'file2.txt', isFile: () => true },
      { name: 'subdir', isFile: () => false },
    ]
    vi.mocked(fs.readdir).mockResolvedValue(mockDirents as never)

    const result = await getFirstFileInDir('/test-path')
    expect(result).toBe('file1.txt')
  })

  it('should return undefined if there are no files in the directory', async () => {
    const mockDirents = [{ name: 'subdir', isFile: () => false }]
    vi.mocked(fs.readdir).mockResolvedValue(mockDirents as never)

    const result = await getFirstFileInDir('/test-path')
    expect(result).toBeUndefined()
  })

  it('should handle an empty directory', async () => {
    vi.mocked(fs.readdir).mockResolvedValue([] as never)

    const result = await getFirstFileInDir('/test-path')
    expect(result).toBeUndefined()
  })

  it('should throw an error if fs.readdir fails', async () => {
    vi.mocked(fs.readdir).mockRejectedValue(new Error('Failed to read directory'))

    await expect(getFirstFileInDir('/test-path')).rejects.toThrow('Failed to read directory')
  })
})
