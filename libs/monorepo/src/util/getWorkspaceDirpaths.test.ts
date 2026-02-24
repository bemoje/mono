import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { vi } from "vitest";
import path from 'upath'
import fs from 'fs-extra'

vi.mock('upath', () => ({
  default: {
    joinSafe: vi.fn((...args: string[]) => args.join('/')),
    normalizeSafe: vi.fn((p: string) => p),
  },
}))
vi.mock('fs-extra', () => ({
  default: {
    existsSync: vi.fn(),
    readJsonSync: vi.fn(),
  },
}))
vi.mock('glob', () => ({
  globSync: vi.fn(),
}))
vi.mock('onetime', () => ({
  default: (fn: () => unknown) => fn,
}))

const mockFs = vi.mocked(fs)
const mockPath = vi.mocked(path)

import { globSync } from 'glob'
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

    expect(() => getWorkspaceDirpaths()).toThrow('No workspaces found in package.json')
  })
})
