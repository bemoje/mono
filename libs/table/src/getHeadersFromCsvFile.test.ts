import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getHeadersFromCsvFile } from './getHeadersFromCsvFile'
import { readFileFirstLine } from '@mono/fs'

vi.mock('@mono/fs', () => {
  return {
    readFileFirstLine: vi.fn(),
  }
})

describe(getHeadersFromCsvFile.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the parsed headers from the first line of a CSV file', async () => {
    const mockFilepath = 'mock.csv'
    vi.mocked(readFileFirstLine).mockResolvedValue('name;age;city')
    const headers = await getHeadersFromCsvFile(mockFilepath)
    expect(headers).toEqual(['name', 'age', 'city'])
    expect(readFileFirstLine).toHaveBeenCalledWith(mockFilepath)
  })

  it('should throw if CSV file is empty', async () => {
    const mockFilepath = 'mock.csv'
    vi.mocked(readFileFirstLine).mockResolvedValue('')
    await expect(getHeadersFromCsvFile(mockFilepath)).rejects.toThrow()
  })
})
