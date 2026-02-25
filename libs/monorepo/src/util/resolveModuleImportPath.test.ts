import { createCompilerHost } from 'typescript'
import { describe } from 'vitest'
import { expect } from 'vitest'
import fs from 'fs-extra/esm'
import { it } from 'vitest'
import { resolveModuleName } from 'typescript'
import upath from 'upath'
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
      relative: vi.fn((from: string, to: string) => {
        return to.replace(`${from}/`, '')
      }),
    },
  }
})
vi.mock('fs-extra', () => {
  return {
    default: {
      existsSync: vi.fn(() => {
        return true
      }),
      readJsonSync: vi.fn(() => {
        return { workspaces: ['libs/*'] }
      }),
    },
  }
})
vi.mock('fs-extra/esm', () => {
  return {
    default: {
      readJsonSync: vi.fn(),
    },
  }
})
vi.mock('onetime', () => {
  return {
    default: (fn: () => unknown) => {
      return fn
    },
  }
})
vi.mock('typescript', () => {
  return {
    resolveModuleName: vi.fn(),
    createCompilerHost: vi.fn(),
  }
})

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
