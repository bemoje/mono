import { describe } from 'vitest'
import { expect } from 'vitest'
import fs from 'fs-extra'
import { globSync } from 'glob'
import { it } from 'vitest'
import path from 'upath'
import { vi } from 'vitest'

vi.mock('upath', () => {
  return {
    default: {
      joinSafe: vi.fn((...args: string[]) => {
        return args.join('/')
      }),
      normalizeSafe: vi.fn((p: string) => {
        return p
      }),
    },
  }
})
vi.mock('fs-extra', () => {
  return {
    default: {
      existsSync: vi.fn(),
      readJsonSync: vi.fn(),
    },
  }
})
vi.mock('glob', () => {
  return {
    globSync: vi.fn(),
  }
})
vi.mock('onetime', () => {
  return {
    default: (fn: () => unknown) => {
      return fn
    },
  }
})
const mockFs = vi.mocked(fs)
const mockPath = vi.mocked(path)
const mockGlobSync = vi.mocked(globSync)

describe('getWorkspaceDirpaths', () => {
  it('should return workspace directory paths from glob patterns', async () => {
    // Mock getRepoRootDirpath (called internally)
    mockFs.existsSync.mockReturnValue(true)
    mockFs.readJsonSync
      .mockReturnValueOnce({ workspaces: ['libs/*', 'apps/*'] }) // getRepoRootDirpath reads root pkg
      .mockReturnValueOnce({ workspaces: ['libs/*', 'apps/*'] }) // getWorkspaceDirpaths reads root pkg

    mockGlobSync.mockReturnValueOnce(['libs/array'] as any).mockReturnValueOnce(['apps/devkit'] as any)

    const { getWorkspaceDirpaths } = await import('./getWorkspaceDirpaths')
    const result = getWorkspaceDirpaths()

    expect(result).toEqual(['libs/array', 'apps/devkit'])
  })

  it('should throw when no workspaces found in package.json', async () => {
    vi.resetModules()

    mockFs.existsSync.mockReturnValue(true)
    mockFs.readJsonSync
      .mockReturnValueOnce({ workspaces: ['libs/*'] }) // getRepoRootDirpath reads root pkg
      .mockReturnValueOnce({ name: 'mono' }) // getWorkspaceDirpaths reads root pkg - no workspaces

    const { getWorkspaceDirpaths } = await import('./getWorkspaceDirpaths')

    expect(() => {
      return getWorkspaceDirpaths()
    }).toThrow('No workspaces found in package.json')
  })
})
