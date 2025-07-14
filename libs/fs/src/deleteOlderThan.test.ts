import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs-extra'
import { deleteOlderThan } from './deleteOlderThan'
import { getFileAge } from './getFileAge'

vi.mock('fs-extra')
vi.mock('./getFileAge')

describe(deleteOlderThan.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('removes files older than the threshold', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['file1.txt', 'file2.txt'] as never)
    vi.mocked(getFileAge).mockResolvedValueOnce(2000).mockResolvedValueOnce(500)
    await deleteOlderThan('/test', 1000)
    expect(fs.remove).toHaveBeenCalledWith('/test/file1.txt')
    expect(fs.remove).not.toHaveBeenCalledWith('/test/file2.txt')
  })

  it('does not remove files if none exceed the age threshold', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['file1.txt', 'file2.txt'] as never)
    vi.mocked(getFileAge).mockResolvedValue(500)
    await deleteOlderThan('/test', 1000)
    expect(fs.remove).not.toHaveBeenCalled()
  })

  it('handles an empty directory gracefully', async () => {
    vi.mocked(fs.readdir).mockResolvedValue([] as never)
    await deleteOlderThan('/test', 1000)
    expect(fs.remove).not.toHaveBeenCalled()
  })
})
