import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'

// Mock dependencies
vi.mock('fs-extra', () => ({
  default: {
    exists: vi.fn(),
    stat: vi.fn(),
  },
  exists: vi.fn(),
  stat: vi.fn(),
}))
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}))
vi.mock('util', () => ({
  default: {
    promisify: vi.fn(),
  },
}))
vi.mock('./isWindows', () => ({
  isWindows: vi.fn(),
}))

describe('winExplorerOpenDirectory', () => {
  let mockFs: any
  let mockSpawn: any
  let mockUtil: any
  let mockIsWindows: any
  let winExplorerOpenDirectory: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Get fresh mocks
    const fs = await import('fs-extra')
    const { spawn } = await import('child_process')
    const util = await import('util')
    const { isWindows } = await import('./isWindows')

    mockFs = vi.mocked(fs.default)
    mockSpawn = vi.mocked(spawn)
    mockUtil = vi.mocked(util.default)
    mockIsWindows = vi.mocked(isWindows)

    // Import fresh module
    const module = await import('./winExplorerOpenDirectory')
    winExplorerOpenDirectory = module.winExplorerOpenDirectory
  })
  it('examples', async () => {
    expect(async () => {
      mockIsWindows.mockReturnValue(true)
      ;(mockFs.exists as any).mockResolvedValue(true)
      ;(mockFs.stat as any).mockResolvedValue({ isFile: () => false })
      const mockPromisifiedSpawn = vi.fn().mockResolvedValue(undefined)
      mockUtil.promisify.mockReturnValue(mockPromisifiedSpawn)

      await winExplorerOpenDirectory('C:\\Users')

      assert.strictEqual(mockPromisifiedSpawn.mock.calls.length, 1, 'spawn called')
    }).not.toThrow()
  })

  it('should open directory when path exists and is directory', async () => {
    mockIsWindows.mockReturnValue(true)
    ;(mockFs.exists as any).mockResolvedValue(true)
    ;(mockFs.stat as any).mockResolvedValue({ isFile: () => false })
    const mockPromisifiedSpawn = vi.fn().mockResolvedValue(undefined)
    mockUtil.promisify.mockReturnValue(mockPromisifiedSpawn)

    await winExplorerOpenDirectory('C:\\Users')

    expect(mockPromisifiedSpawn).toHaveBeenCalledWith('explorer.exe', ['C:\\Users'], { detached: true })
  })

  it('should open parent directory when path is a file', async () => {
    mockIsWindows.mockReturnValue(true)
    ;(mockFs.exists as any).mockResolvedValue(true)
    ;(mockFs.stat as any).mockResolvedValue({ isFile: () => true })
    const mockPromisifiedSpawn = vi.fn().mockResolvedValue(undefined)
    mockUtil.promisify.mockReturnValue(mockPromisifiedSpawn)

    await winExplorerOpenDirectory('C:\\Users\\file.txt')

    expect(mockPromisifiedSpawn).toHaveBeenCalledWith('explorer.exe', ['C:/Users'], { detached: true })
  })

  it('should throw error when not on Windows', async () => {
    mockIsWindows.mockReturnValue(false)

    await expect(winExplorerOpenDirectory('C:\\Users')).rejects.toThrow('Not Windows OS')

    expect(mockFs.exists).not.toHaveBeenCalled()
  })

  it('should throw error when path does not exist', async () => {
    mockIsWindows.mockReturnValue(true)
    ;(mockFs.exists as any).mockResolvedValue(false)

    await expect(winExplorerOpenDirectory('C:\\NonExistent')).rejects.toThrow('Path does not exist')

    expect(mockFs.stat).not.toHaveBeenCalled()
  })

  it('should check if Windows OS first', async () => {
    mockIsWindows.mockReturnValue(false)

    await expect(winExplorerOpenDirectory('C:\\Users')).rejects.toThrow('Not Windows OS')

    expect(mockIsWindows).toHaveBeenCalledOnce()
    expect(mockFs.exists).not.toHaveBeenCalled()
  })

  it('should check if path exists before opening', async () => {
    mockIsWindows.mockReturnValue(true)
    ;(mockFs.exists as any).mockResolvedValue(false)

    await expect(winExplorerOpenDirectory('C:\\NonExistent')).rejects.toThrow('Path does not exist')

    expect(mockFs.exists).toHaveBeenCalledWith('C:\\NonExistent')
    expect(mockFs.stat).not.toHaveBeenCalled()
  })
})
