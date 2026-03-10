import { MonoRepo } from '../MonoRepo'
import { afterEach } from 'vitest'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import fs from 'fs-extra'
import { getAllWorkspacePackageJsonPaths } from './getAllWorkspacePackageJsonPaths'
import { getImportsRecursively } from './getImportsRecursively'
import { getRepoPackageJson } from './getRepoPackageJson'
import { it } from 'vitest'
import { resolveModuleImportPath } from '../util/resolveModuleImportPath'
import { vi } from 'vitest'

vi.mock('mnemonist', () => {
  return {
    DefaultMap: class DefaultMap<K, V> extends Map<K, V> {
      factory: () => V
      constructor(factory: () => V) {
        super()
        this.factory = factory
      }
      override get(key: K): V {
        if (!this.has(key)) {
          this.set(key, this.factory())
        }
        return super.get(key) as V
      }
    },
  }
})
vi.mock('../MonoRepo', () => {
  return { MonoRepo: vi.fn() }
})
vi.mock('fs-extra', () => {
  return { default: { readJsonSync: vi.fn(), readFileSync: vi.fn() } }
})
vi.mock('./getAllWorkspacePackageJsonPaths', () => {
  return { getAllWorkspacePackageJsonPaths: vi.fn() }
})
vi.mock('./getRepoPackageJson', () => {
  return { getRepoPackageJson: vi.fn() }
})
vi.mock('../util/resolveModuleImportPath', () => {
  return { resolveModuleImportPath: vi.fn() }
})
vi.mock('@mono/path', () => {
  return {
    toCwdRelative: vi.fn((p: string) => {
      return p
    }),
  }
})
vi.mock('upath', () => {
  return {
    default: {
      basename: vi.fn((p: string) => {
        const parts = p.split('/')
        return parts[parts.length - 1]
      }),
    },
  }
})

const mockMonoRepo = vi.mocked(MonoRepo)
const mockFs = vi.mocked(fs)
const mockGetAllPkgPaths = vi.mocked(getAllWorkspacePackageJsonPaths)
const mockGetRepoPkg = vi.mocked(getRepoPackageJson)
const mockResolve = vi.mocked(resolveModuleImportPath)

interface MockImport {
  module: { from: string; isBuiltin: boolean; isRelative: boolean; isRepoScoped: boolean }
  specifiers?: { importedNamesArray: string[] }
  parent: { parent: { path: string } }
}

function createMockImport(opts: {
  from: string
  filepath: string
  isBuiltin?: boolean
  isRelative?: boolean
  isRepoScoped?: boolean
  importedNames?: string[]
}): MockImport {
  return {
    module: {
      from: opts.from,
      isBuiltin: opts.isBuiltin ?? false,
      isRelative: opts.isRelative ?? false,
      isRepoScoped: opts.isRepoScoped ?? false,
    },
    specifiers: opts.importedNames ? { importedNamesArray: opts.importedNames } : undefined,
    parent: { parent: { path: opts.filepath } },
  }
}

function createMockTsFile(filepath: string, imports: MockImport[], wsName = 'ws') {
  return { isSourceFile: true, path: filepath, parent: { name: wsName }, tsCode: { imports } }
}

function setupMonoRepo(tsFilesByWs: Record<string, ReturnType<typeof createMockTsFile>[]>) {
  const workspaces = Object.entries(tsFilesByWs).map(([, files]) => {
    return { tsFiles: files }
  })
  mockMonoRepo.mockImplementation(() => {
    return { workspaces } as unknown as MonoRepo
  })
}

describe(getImportsRecursively.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetRepoPkg.mockResolvedValue({ dependencies: {}, devDependencies: {} } as never)
    mockGetAllPkgPaths.mockResolvedValue([])
    mockFs.readJsonSync.mockReturnValue({})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should throw when entry points are in different workspaces', async () => {
    await expect(getImportsRecursively(['libs/a/src/all.ts', 'libs/b/src/all.ts'])).rejects.toThrow(
      'All entry points must be in the same workspace'
    )
  })

  it('should return empty result for entry point with no imports', async () => {
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.filepaths).toEqual(['libs/ws/src/all.ts'])
    expect(result.local.external).toEqual([])
    expect(result.local.builtin).toEqual([])
    expect(result.local.internal).toEqual([])
    expect(result.recursive.external).toEqual([])
    expect(result.recursive.builtin).toEqual([])
    expect(result.recursive.internal).toEqual([])
  })

  it('should categorize builtin imports', async () => {
    const imp = createMockImport({ from: 'node:fs', filepath: 'libs/ws/src/all.ts', isBuiltin: true })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.builtin).toEqual(['node:fs'])
    expect(result.recursive.builtin).toEqual(['node:fs'])
  })

  it('should follow relative imports recursively', async () => {
    const imp = createMockImport({ from: './helper', filepath: 'libs/ws/src/all.ts', isRelative: true })
    const helperFile = createMockTsFile('libs/ws/src/helper.ts', [], 'ws')
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile, helperFile] })

    mockResolve.mockReturnValue({ resolvedFileName: 'libs/ws/src/helper.ts' } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.filepaths).toContain('libs/ws/src/all.ts')
    expect(result.filepaths).toContain('libs/ws/src/helper.ts')
  })

  it('should handle circular imports', async () => {
    const impToB = createMockImport({ from: './b', filepath: 'libs/ws/src/a.ts', isRelative: true })
    const impToA = createMockImport({ from: './a', filepath: 'libs/ws/src/b.ts', isRelative: true })
    const fileA = createMockTsFile('libs/ws/src/a.ts', [impToB], 'ws')
    const fileB = createMockTsFile('libs/ws/src/b.ts', [impToA], 'ws')
    setupMonoRepo({ ws: [fileA, fileB] })

    mockResolve.mockImplementation((_filepath, importFrom) => {
      if (importFrom === './b') {
        return { resolvedFileName: 'libs/ws/src/b.ts' } as never
      }
      if (importFrom === './a') {
        return { resolvedFileName: 'libs/ws/src/a.ts' } as never
      }
      return undefined as never
    })

    const result = await getImportsRecursively(['libs/ws/src/a.ts'])

    expect(result.filepaths).toContain('[CIRCULAR]: libs/ws/src/a.ts')
  })

  it('should handle repo-scoped imports ending in src/index.ts', async () => {
    const imp = createMockImport({
      from: '@mono/other',
      filepath: 'libs/ws/src/all.ts',
      isRepoScoped: true,
      importedNames: ['helperFn'],
    })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    const otherFile = createMockTsFile('libs/other/src/helperFn.ts', [], 'other')
    setupMonoRepo({ ws: [entryFile], other: [otherFile] })

    mockResolve.mockReturnValue({ resolvedFileName: 'libs/other/src/index.ts' } as never)

    mockFs.readFileSync.mockReturnValue('export function helperFn() {}')

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.internal).toEqual(['@mono/other'])
    expect(result.recursive.internal).toContain('@mono/other')
  })

  it('should handle repo-scoped imports where files do not contain matching export', async () => {
    const imp = createMockImport({
      from: '@mono/other',
      filepath: 'libs/ws/src/all.ts',
      isRepoScoped: true,
      importedNames: ['helperFn'],
    })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    const otherFile = createMockTsFile('libs/other/src/helperFn.ts', [], 'other')
    setupMonoRepo({ ws: [entryFile], other: [otherFile] })

    mockResolve.mockReturnValue({ resolvedFileName: 'libs/other/src/index.ts' } as never)

    mockFs.readFileSync.mockReturnValue('const x = 1')

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.internal).toEqual(['@mono/other'])
    expect(result.filepaths).not.toContain('libs/other/src/helperFn.ts')
  })

  it('should handle external imports with matching packageId', async () => {
    const imp = createMockImport({ from: 'lodash', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/lodash/index.js',
      packageId: { name: 'lodash', version: '4.17.21' },
    } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.external).toContain('"lodash": "^4.17.21",')
    expect(result.recursive.external).toContain('"lodash": "^4.17.21",')
  })

  it('should handle external imports where depName differs from pkgName and found in rootPkg', async () => {
    const imp = createMockImport({ from: 'some-alias', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/actual-pkg/index.js',
      packageId: { name: 'actual-pkg', version: '1.0.0' },
    } as never)

    mockGetRepoPkg.mockResolvedValue({ dependencies: { 'some-alias': '^1.0.0' }, devDependencies: {} } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.external).toContain('"actual-pkg": "^1.0.0",')
    expect(result.local.external).toContain('"some-alias": "^1.0.0",')
  })

  it('should handle external imports where depName differs from pkgName and found in devDependencies', async () => {
    const imp = createMockImport({ from: 'some-alias', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/actual-pkg/index.js',
      packageId: { name: 'actual-pkg', version: '1.0.0' },
    } as never)

    mockGetRepoPkg.mockResolvedValue({ dependencies: {}, devDependencies: { 'some-alias': '^1.0.0' } } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.external).toContain('"some-alias": "^1.0.0",')
  })

  it('should handle external imports where depName found in allPkgJsons', async () => {
    const imp = createMockImport({ from: 'dep-alias', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/real-pkg/index.js',
      packageId: { name: 'real-pkg', version: '2.0.0' },
    } as never)

    mockGetRepoPkg.mockResolvedValue({ dependencies: {}, devDependencies: {} } as never)

    mockGetAllPkgPaths.mockResolvedValue(['libs/other/package.json'])
    mockFs.readJsonSync.mockReturnValue({ dependencies: { 'dep-alias': '^2.0.0' } })

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.external).toContain('"real-pkg": "^2.0.0",')
    expect(result.local.external).toContain('"dep-alias": "^2.0.0",')
  })

  it('should handle external imports where depName found in allPkgJsons devDependencies', async () => {
    const imp = createMockImport({ from: 'dep-alias', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/real-pkg/index.js',
      packageId: { name: 'real-pkg', version: '2.0.0' },
    } as never)

    mockGetRepoPkg.mockResolvedValue({ dependencies: {}, devDependencies: {} } as never)

    mockGetAllPkgPaths.mockResolvedValue(['libs/other/package.json'])
    mockFs.readJsonSync.mockReturnValue({ devDependencies: { 'dep-alias': '^3.0.0' } })

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.external).toContain('"dep-alias": "^3.0.0",')
  })

  it('should throw when depName differs from pkgName and version cannot be found', async () => {
    const imp = createMockImport({ from: 'some-alias', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/actual-pkg/index.js',
      packageId: { name: 'actual-pkg', version: '1.0.0' },
    } as never)

    mockGetRepoPkg.mockResolvedValue({ dependencies: {}, devDependencies: {} } as never)

    mockGetAllPkgPaths.mockResolvedValue([])

    await expect(getImportsRecursively(['libs/ws/src/all.ts'])).rejects.toThrow(
      'Could not find version for dependency "some-alias"'
    )
  })

  it('should throw when import cannot be resolved', async () => {
    const imp = createMockImport({ from: 'nonexistent', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue(undefined as never)

    await expect(getImportsRecursively(['libs/ws/src/all.ts'])).rejects.toThrow(
      'Could not resolve import "nonexistent"'
    )
  })

  it('should handle external imports without version in packageId', async () => {
    const imp = createMockImport({ from: 'somepkg', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/somepkg/index.js',
      packageId: { name: 'somepkg', version: '' },
    } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.external).toContain('"somepkg": "",')
  })

  it('should handle external imports without packageId at all', async () => {
    const imp = createMockImport({ from: 'somepkg', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({ resolvedFileName: 'node_modules/somepkg/index.js' } as never)

    mockGetRepoPkg.mockResolvedValue({ dependencies: { somepkg: '^1.0.0' }, devDependencies: {} } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    // pkgName is undefined, version is '', depName is 'somepkg'
    // depName !== pkgName so it looks up version from rootPkg
    expect(result.local.external).toContain('"undefined": "",')
    expect(result.local.external).toContain('"somepkg": "^1.0.0",')
  })

  it('should handle scoped external imports', async () => {
    const imp = createMockImport({ from: '@scope/pkg', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/@scope/pkg/index.js',
      packageId: { name: '@scope/pkg', version: '1.0.0' },
    } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.external).toContain('"@scope/pkg": "^1.0.0",')
  })

  it('should handle multiple entry points in the same workspace', async () => {
    const fileA = createMockTsFile('libs/ws/src/a.ts', [], 'ws')
    const fileB = createMockTsFile('libs/ws/src/b.ts', [], 'ws')
    setupMonoRepo({ ws: [fileA, fileB] })

    const result = await getImportsRecursively(['libs/ws/src/a.ts', 'libs/ws/src/b.ts'])

    expect(result.filepaths).toContain('libs/ws/src/a.ts')
    expect(result.filepaths).toContain('libs/ws/src/b.ts')
  })

  it('should categorize imports from non-local workspaces as recursive', async () => {
    const relImp = createMockImport({ from: './util', filepath: 'libs/ws/src/all.ts', isRelative: true })
    const builtinImp = createMockImport({ from: 'node:path', filepath: 'libs/ws/src/util.ts', isBuiltin: true })
    const utilFile = createMockTsFile('libs/other/src/util.ts', [builtinImp], 'other')
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [relImp], 'ws')
    setupMonoRepo({ ws: [entryFile], other: [utilFile] })

    mockResolve.mockReturnValue({ resolvedFileName: 'libs/other/src/util.ts' } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    // builtin from non-local workspace should only be in recursive
    expect(result.recursive.builtin).toContain('node:path')
    // local builtins should not have it
    expect(result.local.builtin).not.toContain('node:path')
  })

  it('should handle repo-scoped imports without specifiers', async () => {
    const imp = createMockImport({ from: '@mono/other', filepath: 'libs/ws/src/all.ts', isRepoScoped: true })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({ resolvedFileName: 'libs/other/src/index.ts' } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.internal).toEqual(['@mono/other'])
  })

  it('should merge local into recursive results', async () => {
    const builtinImp = createMockImport({ from: 'node:fs', filepath: 'libs/ws/src/all.ts', isBuiltin: true })
    const extImp = createMockImport({ from: 'lodash', filepath: 'libs/ws/src/all.ts' })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [builtinImp, extImp], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    mockResolve.mockReturnValue({
      resolvedFileName: 'node_modules/lodash/index.js',
      packageId: { name: 'lodash', version: '4.17.21' },
    } as never)

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    // Local values should be duplicated in recursive
    expect(result.recursive.builtin).toEqual(result.local.builtin)
    expect(result.recursive.external).toEqual(result.local.external)
  })

  it('should sort result arrays', async () => {
    const imp1 = createMockImport({ from: 'node:zlib', filepath: 'libs/ws/src/all.ts', isBuiltin: true })
    const imp2 = createMockImport({ from: 'node:assert', filepath: 'libs/ws/src/all.ts', isBuiltin: true })
    const entryFile = createMockTsFile('libs/ws/src/all.ts', [imp1, imp2], 'ws')
    setupMonoRepo({ ws: [entryFile] })

    const result = await getImportsRecursively(['libs/ws/src/all.ts'])

    expect(result.local.builtin).toEqual(['node:assert', 'node:zlib'])
  })
})
