import { describe, expect, it, vi } from 'vitest'
import path from 'upath'
import fs from 'fs-extra'

vi.mock('upath', () => ({
  default: {
    normalizeSafe: vi.fn((p: string) => p),
    joinSafe: vi.fn((...args: string[]) => args.join('/')),
    dirname: vi.fn((p: string) => {
      const parts = p.split('/')
      return parts.length > 1 ? parts.slice(0, -1).join('/') : p
    }),
  },
}))
vi.mock('fs-extra', () => ({
  default: {
    existsSync: vi.fn(),
    readJsonSync: vi.fn(),
  },
}))
vi.mock('onetime', () => ({
  default: (fn: () => unknown) => fn,
}))

const mockFs = vi.mocked(fs)
const mockPath = vi.mocked(path)

describe('getRepoRootDirpath', () => {
  it('should return dirpath when package.json with workspaces is found', async () => {
    mockFs.existsSync.mockReturnValue(true)
    mockFs.readJsonSync.mockReturnValue({ workspaces: ['libs/*'] })

    const { getRepoRootDirpath } = await import('./getRepoRootDirpath')
    const result = getRepoRootDirpath()

    expect(result).toBe(process.cwd())
  })

  it('should recurse up to parent when no workspaces found at current level', async () => {
    vi.resetModules()

    mockFs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true)
    mockFs.readJsonSync.mockReturnValueOnce({}).mockReturnValueOnce({ workspaces: ['libs/*'] })
    mockPath.dirname.mockReturnValueOnce('/parent')

    const { getRepoRootDirpath } = await import('./getRepoRootDirpath')
    const result = getRepoRootDirpath()

    expect(result).toBe('/parent')
  })

  it('should recurse up when package.json does not exist', async () => {
    vi.resetModules()

    mockFs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true)
    mockFs.readJsonSync.mockReturnValue({ workspaces: ['libs/*'] })
    mockPath.dirname.mockReturnValueOnce('/parent')

    const { getRepoRootDirpath } = await import('./getRepoRootDirpath')
    const result = getRepoRootDirpath()

    expect(result).toBe('/parent')
  })

  it('should throw when reaching root without finding repo root', async () => {
    vi.resetModules()

    mockFs.existsSync.mockReturnValue(false)
    mockPath.normalizeSafe.mockReturnValue('/')
    mockPath.dirname.mockReturnValue('/')

    const { getRepoRootDirpath } = await import('./getRepoRootDirpath')

    expect(() => getRepoRootDirpath()).toThrow('Could not find repo root from process.cwd()')
  })
})
