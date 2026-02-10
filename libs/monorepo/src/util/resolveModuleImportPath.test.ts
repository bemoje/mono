import { describe, expect, it, vi } from 'vitest'
import upath from 'upath'
import fs from 'fs-extra/esm'
import { resolveModuleName, createCompilerHost } from 'typescript'

vi.mock('upath', () => ({
  default: {
    joinSafe: vi.fn((...args: string[]) => args.join('/')),
    normalizeSafe: vi.fn((p: string) => p),
    relative: vi.fn((from: string, to: string) => to.replace(from + '/', '')),
  },
}))
vi.mock('fs-extra', () => ({
  default: {
    existsSync: vi.fn(() => true),
    readJsonSync: vi.fn(() => ({ workspaces: ['libs/*'] })),
  },
}))
vi.mock('fs-extra/esm', () => ({
  default: {
    readJsonSync: vi.fn(),
  },
}))
vi.mock('onetime', () => ({
  default: (fn: () => unknown) => fn,
}))
vi.mock('typescript', () => ({
  resolveModuleName: vi.fn(),
  createCompilerHost: vi.fn(),
}))

const mockFs = vi.mocked(fs)
const mockResolveModuleName = vi.mocked(resolveModuleName)
const mockCreateCompilerHost = vi.mocked(createCompilerHost)

describe('resolveModuleImportPath', () => {
  it('should resolve and relativize a module import path', async () => {
    mockFs.readJsonSync.mockReturnValue({ compilerOptions: { paths: { '@mono/*': ['libs/*/src'] } } })
    mockCreateCompilerHost.mockReturnValue({} as any)
    mockResolveModuleName.mockReturnValue({
      resolvedModule: { resolvedFileName: '/root/libs/array/src/index.ts' } as any,
    } as any)
    vi.mocked(upath.relative).mockReturnValue('libs/array/src/index.ts')

    const { resolveModuleImportPath } = await import('./resolveModuleImportPath')
    const result = resolveModuleImportPath('/root/libs/foo/src/bar.ts', '@mono/array')

    expect(result).toBeDefined()
    expect(result!.resolvedFileName).toBe('libs/array/src/index.ts')
  })

  it('should return undefined when module is not resolved', async () => {
    vi.resetModules()
    mockFs.readJsonSync.mockReturnValue({ compilerOptions: { paths: {} } })
    mockCreateCompilerHost.mockReturnValue({} as any)
    mockResolveModuleName.mockReturnValue({ resolvedModule: undefined } as any)

    const { resolveModuleImportPath } = await import('./resolveModuleImportPath')
    const result = resolveModuleImportPath('/root/libs/foo/src/bar.ts', 'nonexistent')

    expect(result).toBeUndefined()
  })
})
