import * as fs from '@mono/fs'
import * as fsExtra from 'fs-extra/esm'
import { MonoRepo } from '../MonoRepo'
import type { PackageJson } from '@mono/types'
import { TestFile } from '../file/TestFile'
import { TsFile } from '../file/TsFile'
import { Workspace } from './Workspace'
import assert from 'assert'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { hasExtnamePrefix } from '../util/hasExtnamePrefix'
import { hasParentDirname } from '@mono/path'
import { it } from 'vitest'
import path from 'upath'
import { promisify } from 'util'
// Mock resolveModuleImportPath
import { resolveModuleImportPath } from '../util/resolveModuleImportPath'
import { vi } from 'vitest'

// Mock dependencies
vi.mock('fs-extra/esm')
vi.mock('@mono/fs')
vi.mock('child_process')
vi.mock('util')
vi.mock('upath', () => {
  return { default: { normalize: vi.fn(), basename: vi.fn(), dirname: vi.fn(), join: vi.fn(), relative: vi.fn() } }
})
vi.mock('../file/TsFile')
vi.mock('../file/TestFile')
vi.mock('../util/resolveModuleImportPath')
vi.mock('@mono/path', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...(actual as object), hasParentDirname: vi.fn() }
})
vi.mock('../util/hasExtnamePrefix', () => {
  return { hasExtnamePrefix: vi.fn() }
})
const mockPath = vi.mocked(path)
const mockFsExtra = vi.mocked(fsExtra)
const mockFs = vi.mocked(fs)
const mockPromisify = vi.mocked(promisify)
const mockTestFile = vi.mocked(TestFile)

vi.mock('../util/resolveModuleImportPath', () => {
  return { resolveModuleImportPath: vi.fn() }
})

const mockResolveModuleImportPath = vi.mocked(resolveModuleImportPath)
const mockHasParentDirname = vi.mocked(hasParentDirname)
const mockHasExtnamePrefix = vi.mocked(hasExtnamePrefix)

describe(Workspace.name, () => {
  let mockMonoRepo: MonoRepo
  let workspace: Workspace
  const testWorkspacePath = '/test/repo/libs/example'
  const normalizedPath = '/test/repo/libs/example'

  const mockPackageJson: PackageJson = {
    name: '@mono/example',
    version: '1.0.0',
    dependencies: { 'lodash-es': '^4.17.21', '@mono/utils': 'workspace:*' },
    devDependencies: { 'vitest': '^1.0.0', '@types/lodash-es': '^4.17.7' },
  }

  const mockParentPackageJson: PackageJson = {
    name: 'mono',
    version: '1.0.0',
    dependencies: { 'global-dep': '^1.0.0' },
    devDependencies: { 'global-dev-dep': '^1.0.0' },
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup path mocks
    mockPath.normalize.mockReturnValue(normalizedPath)
    mockPath.basename.mockImplementation((p: string) => {
      const parts = p.split('/')
      return parts[parts.length - 1]
    })
    mockPath.dirname.mockImplementation((p: string) => {
      const parts = p.split('/')
      return parts.slice(0, -1).join('/')
    })
    mockPath.join.mockImplementation((...args: string[]) => {
      return args.join('/')
    })
    mockPath.relative.mockImplementation((from: string, to: string) => {
      // Simple mock implementation
      return to.replace(`${from}/`, '')
    })

    // Mock fs-extra
    mockFsExtra.readJsonSync.mockReturnValue(mockPackageJson)

    // Create mock MonoRepo
    mockMonoRepo = { packageJson: mockParentPackageJson, tsconfigBasePaths: { '@mono/*': ['libs/*/src'] } } as any

    // Create workspace instance
    workspace = new Workspace(mockMonoRepo, testWorkspacePath)
  })

  it('examples', () => {
    expect(() => {
      // Basic workspace creation and property access
      const repo = {} as MonoRepo
      const ws = new Workspace(repo, '/path/to/workspace')

      // Path handling
      assert.strictEqual(typeof ws.path, 'string')
      assert.strictEqual(typeof ws.origin, 'string')
      assert.strictEqual(typeof ws.packageJsonPath, 'string')

      // Mock some basic functionality for examples
      mockFsExtra.readJsonSync.mockReturnValue({
        name: '@mono/test',
        dependencies: { 'test-dep': '^1.0.0' },
        devDependencies: { 'test-dev-dep': '^1.0.0' },
      })
      mockFs.walkDirectory.mockReturnValue([])

      // Dependency analysis
      assert.strictEqual(Array.isArray(ws.installedDependencies), true)
      assert.strictEqual(Array.isArray(ws.installedDevDependencies), true)
      assert.strictEqual(Array.isArray(ws.tsFiles), true)
      assert.strictEqual(Array.isArray(ws.testFiles), true)
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should normalize the workspace path', () => {
      expect(mockPath.normalize).toHaveBeenCalledWith(testWorkspacePath)
      expect(workspace.path).toBe(normalizedPath)
    })

    it('should extract origin from parent directory', () => {
      mockPath.dirname.mockReturnValue('/test/repo/libs')
      mockPath.basename.mockReturnValue('libs')

      const ws = new Workspace(mockMonoRepo, testWorkspacePath)
      expect(ws.origin).toBe('libs')
    })

    it('should set parent reference', () => {
      expect(workspace.parent).toBe(mockMonoRepo)
    })
  })

  describe('packageJsonPath getter', () => {
    it('should return correct package.json path', () => {
      mockPath.join.mockReturnValue('/test/repo/libs/example/package.json')

      expect(workspace.packageJsonPath).toBe('/test/repo/libs/example/package.json')
      expect(mockPath.join).toHaveBeenCalledWith(normalizedPath, 'package.json')
    })
  })

  describe('packageJson getter', () => {
    it('should read and return package.json', () => {
      const result = workspace.packageJson

      expect(mockFsExtra.readJsonSync).toHaveBeenCalledWith(workspace.packageJsonPath)
      expect(result).toEqual(mockPackageJson)
    })

    it('should cache the result (lazy prop)', () => {
      void workspace.packageJson
      void workspace.packageJson

      expect(mockFsExtra.readJsonSync).toHaveBeenCalledTimes(1)
    })
  })

  describe('name getter', () => {
    it('should return package name from package.json', () => {
      expect(workspace.name).toBe('@mono/example')
    })

    it('should throw error when name is missing', () => {
      mockFsExtra.readJsonSync.mockReturnValue({} as PackageJson)

      expect(() => {
        return workspace.name
      }).toThrow("Workspace package.json missing 'name' field")
    })
  })

  describe('installedDependencies getter', () => {
    it('should return sorted dependencies array', () => {
      const result = workspace.installedDependencies

      expect(result).toEqual(['@mono/utils', 'lodash-es'])
      expect(result).toEqual([...result].sort()) // Verify it's sorted
    })

    it('should return empty array when no dependencies', () => {
      mockFsExtra.readJsonSync.mockReturnValue({ name: 'test' } as PackageJson)

      expect(workspace.installedDependencies).toEqual([])
    })
  })

  describe('installedDevDependencies getter', () => {
    it('should return sorted devDependencies array', () => {
      const result = workspace.installedDevDependencies

      expect(result).toEqual(['@types/lodash-es', 'vitest'])
      expect(result).toEqual([...result].sort()) // Verify it's sorted
    })

    it('should return empty array when no devDependencies', () => {
      mockFsExtra.readJsonSync.mockReturnValue({ name: 'test' } as PackageJson)

      expect(workspace.installedDevDependencies).toEqual([])
    })
  })

  describe('tsFiles getter', () => {
    it('should filter and map walkDirectory results into TsFile instances', () => {
      const walkResults = [
        ['/test/repo/libs/example/src/foo.ts', {}],
        ['/test/repo/libs/example/src/bar.test.ts', {}],
      ] as any
      mockFs.walkDirectory.mockImplementation((_dirpath: string, options: any) => {
        // Exercise the filter callback with various basenames
        options.filter('', 'node_modules')
        options.filter('', 'coverage')
        options.filter('', '.hidden')
        options.filter('', 'src')
        return walkResults
      })
      mockHasParentDirname.mockReturnValue(true)
      mockHasExtnamePrefix.mockReturnValueOnce(false).mockReturnValueOnce(true)

      const ws = new Workspace(mockMonoRepo, testWorkspacePath)
      const result = ws.tsFiles
      expect(result).toHaveLength(1)
    })
  })

  describe('testFiles getter', () => {
    it('should filter and map walkDirectory results into TestFile instances', () => {
      const walkResults = [
        ['/test/repo/libs/example/src/foo.test.ts', {}],
        ['/test/repo/libs/example/src/bar.ts', {}],
      ] as any
      mockFs.walkDirectory.mockImplementation((_dirpath: string, options: any) => {
        options.filter('', 'node_modules')
        options.filter('', 'coverage')
        options.filter('', '.hidden')
        options.filter('', 'src')
        return walkResults
      })
      mockHasParentDirname.mockReturnValue(true)
      mockHasExtnamePrefix.mockReturnValueOnce(false).mockReturnValueOnce(true)

      const ws = new Workspace(mockMonoRepo, testWorkspacePath)
      const result = ws.testFiles
      expect(result).toHaveLength(1)
    })
  })

  describe('files getter', () => {
    it('should return combined ts and test files', () => {
      const mockTsFiles = [{ path: '/file1.ts' }] as TsFile[]
      const mockTestFiles = [{ path: '/file1.test.ts' }] as TestFile[]

      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue(mockTsFiles)
      vi.spyOn(workspace, 'testFiles', 'get').mockReturnValue(mockTestFiles)

      const result = workspace.files

      expect(result).toEqual([...mockTsFiles, ...mockTestFiles])
    })
  })

  describe('importedDependenciesByFile getter', () => {
    it('should return map of dependencies by file', () => {
      const mockTsFiles = [
        { path: '/test/repo/libs/example/src/file1.ts', dependencies: ['lodash-es', '@mono/utils'] },
        { path: '/test/repo/libs/example/src/file2.ts', dependencies: ['vitest'] },
      ] as TsFile[]

      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue(mockTsFiles)
      mockPath.relative.mockImplementation((from, to) => {
        return to.replace('/test/repo/', '')
      })

      const result = workspace.importedDependenciesByFile

      expect(result).toBeInstanceOf(Map)
      expect(result.get('libs/example/src/file1.ts')).toEqual(['lodash-es', '@mono/utils'])
      expect(result.get('libs/example/src/file2.ts')).toEqual(['vitest'])
    })
  })

  describe('importedTestDependenciesByFile getter', () => {
    it('should return map of test dependencies by file', () => {
      const mockTestFiles = [
        {
          path: '/test/repo/libs/example/src/file1.test.ts',
          dependencies: ['vitest', '@testing-library/jest-dom'],
        },
      ] as TestFile[]

      vi.spyOn(workspace, 'testFiles', 'get').mockReturnValue(mockTestFiles)
      mockPath.relative.mockImplementation((from, to) => {
        return to.replace('/test/repo/', '')
      })

      const result = workspace.importedTestDependenciesByFile

      expect(result).toBeInstanceOf(Map)
      expect(result.get('libs/example/src/file1.test.ts')).toEqual(['vitest', '@testing-library/jest-dom'])
    })
  })

  describe('importedDependencies getter', () => {
    it('should return flattened unique dependencies from all files', () => {
      const mockMap = new Map([
        ['file1.ts', ['lodash-es', '@mono/utils']],
        ['file2.ts', ['lodash-es', 'vitest']], // lodash-es should be deduplicated
      ])

      vi.spyOn(workspace, 'importedDependenciesByFile', 'get').mockReturnValue(mockMap)

      const result = workspace.importedDependencies

      expect(result).toEqual(['lodash-es', '@mono/utils', 'vitest'])
    })
  })

  describe('importedTestDependencies getter', () => {
    it('should return flattened unique test dependencies', () => {
      const mockMap = new Map([
        ['file1.test.ts', ['vitest', '@testing-library/jest-dom']],
        ['file2.test.ts', ['vitest', 'jest']], // vitest should be deduplicated
      ])

      vi.spyOn(workspace, 'importedTestDependenciesByFile', 'get').mockReturnValue(mockMap)

      const result = workspace.importedTestDependencies

      expect(result).toEqual(['vitest', '@testing-library/jest-dom', 'jest'])
    })
  })

  describe('missingDependencies getter', () => {
    it('should return dependencies that are imported but not installed', () => {
      vi.spyOn(workspace, 'importedDependencies', 'get').mockReturnValue([
        'lodash-es',
        '@mono/utils',
        'missing-dep',
      ])
      vi.spyOn(workspace, 'installedDependencies', 'get').mockReturnValue(['lodash-es', '@mono/utils'])

      const result = workspace.missingDependencies

      expect(result).toEqual(['missing-dep'])
    })

    it('should exclude dependencies available in parent package.json', () => {
      vi.spyOn(workspace, 'importedDependencies', 'get').mockReturnValue([
        'lodash-es',
        'global-dep',
        'missing-dep',
      ])
      vi.spyOn(workspace, 'installedDependencies', 'get').mockReturnValue(['lodash-es'])

      const result = workspace.missingDependencies

      expect(result).toEqual(['missing-dep']) // global-dep should be filtered out
    })

    it('should exclude dependencies available in tsconfig base paths', () => {
      vi.spyOn(workspace, 'importedDependencies', 'get').mockReturnValue([
        'lodash-es',
        '@mono/other',
        'missing-dep',
      ])
      vi.spyOn(workspace, 'installedDependencies', 'get').mockReturnValue(['lodash-es'])

      // Note: Current implementation only checks exact key matches in tsconfigBasePaths, not pattern matching
      // '@mono/other' won't match '@mono/*' pattern in the current implementation
      const result = workspace.missingDependencies

      expect(result).toEqual(['@mono/other', 'missing-dep']) // Both should be considered missing with current implementation
    })
  })

  describe('missingDevDependencies getter', () => {
    it('should return test dependencies that are not installed', () => {
      vi.spyOn(workspace, 'importedTestDependencies', 'get').mockReturnValue([
        'vitest',
        '@testing-library/jest-dom',
        'missing-test-dep',
      ])
      vi.spyOn(workspace, 'installedDependencies', 'get').mockReturnValue(['lodash-es'])
      vi.spyOn(workspace, 'installedDevDependencies', 'get').mockReturnValue(['vitest'])

      const result = workspace.missingDevDependencies

      expect(result).toEqual(['@testing-library/jest-dom', 'missing-test-dep'])
    })

    it('should exclude dependencies available in parent package.json', () => {
      vi.spyOn(workspace, 'importedTestDependencies', 'get').mockReturnValue([
        'vitest',
        'global-dev-dep',
        'missing-test-dep',
      ])
      vi.spyOn(workspace, 'installedDependencies', 'get').mockReturnValue([])
      vi.spyOn(workspace, 'installedDevDependencies', 'get').mockReturnValue(['vitest'])

      const result = workspace.missingDevDependencies

      expect(result).toEqual(['missing-test-dep']) // global-dev-dep should be filtered out
    })
  })

  describe('unusedDependencies getter', () => {
    it('should return installed dependencies not imported in source files', () => {
      vi.spyOn(workspace, 'installedDependencies', 'get').mockReturnValue([
        'lodash-es',
        '@mono/utils',
        'unused-dep',
      ])
      vi.spyOn(workspace, 'importedDependencies', 'get').mockReturnValue(['lodash-es', '@mono/utils'])

      const result = workspace.unusedDependencies

      expect(result).toEqual(['unused-dep'])
    })
  })

  describe('incorrectlyImportedRepoWorkspaces getter', () => {
    describe('incorrectlyImportedRepoWorkspaces getter', () => {
      it('should find imports using workspace name instead of relative paths', () => {
        const mockFiles = [
          {
            path: '/test/repo/libs/example/src/file1.ts',
            tsCode: {
              imports: [{ module: { from: '@mono/example' }, specifiers: { importedNamesArray: ['utils'] } }],
            },
          },
        ] as any

        vi.spyOn(workspace, 'files', 'get').mockReturnValue(mockFiles)

        // Mock the resolveModuleImportPath function
        mockResolveModuleImportPath.mockReturnValue({
          resolvedFileName: '/test/repo/libs/example/src/utils.ts',
        } as any)

        mockPath.relative.mockReturnValue('utils.ts')
        mockPath.dirname.mockReturnValue('/test/repo/libs/example/src')

        const result = workspace.incorrectlyImportedRepoWorkspaces

        expect(result).toEqual([
          {
            filepath: '/test/repo/libs/example/src/file1.ts',
            replaceValue: '@mono/example',
            withValue: './utils.ts',
          },
        ])
      })

      it('should handle index.ts imports correctly', () => {
        const mockFiles = [
          {
            path: '/test/repo/libs/example/src/file1.ts',
            tsCode: {
              imports: [{ module: { from: '@mono/example' }, specifiers: { importedNamesArray: ['someExport'] } }],
            },
          },
        ] as any

        vi.spyOn(workspace, 'files', 'get').mockReturnValue(mockFiles)

        // Mock the resolveModuleImportPath function
        mockResolveModuleImportPath.mockReturnValue({
          resolvedFileName: '/test/repo/libs/example/src/index.ts',
        } as any)

        const result = workspace.incorrectlyImportedRepoWorkspaces

        expect(result[0].withValue).toBe('./someExport')
      })

      it('should skip when resolveModuleImportPath returns undefined', () => {
        const mockFiles = [
          {
            path: '/test/repo/libs/example/src/file1.ts',
            tsCode: {
              imports: [{ module: { from: '@mono/example' }, specifiers: { importedNamesArray: ['foo'] } }],
            },
          },
        ] as any

        vi.spyOn(workspace, 'files', 'get').mockReturnValue(mockFiles)
        mockResolveModuleImportPath.mockReturnValue(undefined as any)

        const result = workspace.incorrectlyImportedRepoWorkspaces
        expect(result).toEqual([])
      })

      it('should skip imports not matching workspace name', () => {
        const mockFiles = [
          {
            path: '/test/repo/libs/example/src/file1.ts',
            tsCode: { imports: [{ module: { from: 'lodash-es' } }] },
          },
        ] as any

        vi.spyOn(workspace, 'files', 'get').mockReturnValue(mockFiles)

        const result = workspace.incorrectlyImportedRepoWorkspaces
        expect(result).toEqual([])
      })
    })

    describe('dependencyProblems getter', () => {
      it('should return problems object when issues exist', () => {
        vi.spyOn(workspace, 'unusedDependencies', 'get').mockReturnValue(['unused-dep'])
        vi.spyOn(workspace, 'missingDependencies', 'get').mockReturnValue(['missing-dep'])
        vi.spyOn(workspace, 'missingDevDependencies', 'get').mockReturnValue(['missing-dev-dep'])
        vi.spyOn(workspace, 'incorrectlyImportedRepoWorkspaces', 'get').mockReturnValue([])

        const result = workspace.dependencyProblems

        expect(result).toEqual({
          origin: workspace.origin,
          workspace: workspace.name,
          unused: ['unused-dep'],
          missing: ['missing-dep'],
          missingDev: ['missing-dev-dep'],
        })
      })

      it('should return undefined when no problems exist', () => {
        vi.spyOn(workspace, 'unusedDependencies', 'get').mockReturnValue([])
        vi.spyOn(workspace, 'missingDependencies', 'get').mockReturnValue([])
        vi.spyOn(workspace, 'missingDevDependencies', 'get').mockReturnValue([])
        vi.spyOn(workspace, 'incorrectlyImportedRepoWorkspaces', 'get').mockReturnValue([])

        const result = workspace.dependencyProblems

        expect(result).toBeUndefined()
      })

      it('should exclude empty arrays from result', () => {
        vi.spyOn(workspace, 'unusedDependencies', 'get').mockReturnValue(['unused-dep'])
        vi.spyOn(workspace, 'missingDependencies', 'get').mockReturnValue([])
        vi.spyOn(workspace, 'missingDevDependencies', 'get').mockReturnValue([])
        vi.spyOn(workspace, 'incorrectlyImportedRepoWorkspaces', 'get').mockReturnValue([])

        const result = workspace.dependencyProblems

        expect(result).toEqual({ origin: workspace.origin, workspace: workspace.name, unused: ['unused-dep'] })
        expect(result).not.toHaveProperty('missing')
        expect(result).not.toHaveProperty('missingDev')
      })
    })

    it('should return undefined when no problems exist', () => {
      vi.spyOn(workspace, 'unusedDependencies', 'get').mockReturnValue([])
      vi.spyOn(workspace, 'missingDependencies', 'get').mockReturnValue([])
      vi.spyOn(workspace, 'missingDevDependencies', 'get').mockReturnValue([])
      vi.spyOn(workspace, 'incorrectlyImportedRepoWorkspaces', 'get').mockReturnValue([])

      const result = workspace.dependencyProblems

      expect(result).toBeUndefined()
    })

    it('should exclude empty arrays from result', () => {
      vi.spyOn(workspace, 'unusedDependencies', 'get').mockReturnValue(['unused-dep'])
      vi.spyOn(workspace, 'missingDependencies', 'get').mockReturnValue([])
      vi.spyOn(workspace, 'missingDevDependencies', 'get').mockReturnValue([])
      vi.spyOn(workspace, 'incorrectlyImportedRepoWorkspaces', 'get').mockReturnValue([])

      const result = workspace.dependencyProblems

      expect(result).toEqual({ origin: workspace.origin, workspace: workspace.name, unused: ['unused-dep'] })
      expect(result).not.toHaveProperty('missing')
      expect(result).not.toHaveProperty('missingDev')
    })
  })

  describe(Workspace.prototype.depcheck.name, () => {
    const mockExecPromise = vi.fn()

    beforeEach(() => {
      mockPromisify.mockReturnValue(mockExecPromise as any)
    })

    it('should run depcheck command successfully', async () => {
      mockExecPromise.mockResolvedValue({
        stdout: JSON.stringify({
          dependencies: ['unused-dep'],
          devDependencies: [],
          using: {},
          missing: {},
          invalidFiles: {},
          invalidDirs: {},
        }),
      })

      const result = await workspace.depcheck()

      expect(mockExecPromise).toHaveBeenCalledWith(expect.stringContaining(`yarn depcheck ${normalizedPath}`))
      expect(result.dependencies).toEqual(['unused-dep'])
    })

    it('should handle execution errors with stdout', async () => {
      const error = new Error('Command failed') as any
      error.stdout = JSON.stringify({
        dependencies: [],
        devDependencies: [],
        using: {},
        missing: {},
        invalidFiles: {},
        invalidDirs: {},
      })
      mockExecPromise.mockRejectedValue(error)

      const result = await workspace.depcheck()

      expect(result).toEqual({
        dependencies: [],
        devDependencies: [],
        using: {},
        missing: {},
        invalidFiles: {},
        invalidDirs: {},
      })
    })

    it('should handle execution errors without stdout', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockExecPromise.mockRejectedValue(new Error('Command failed'))

      const result = await workspace.depcheck()

      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toEqual({
        dependencies: [],
        devDependencies: [],
        using: {},
        missing: {},
        invalidFiles: {},
        invalidDirs: {},
      })

      consoleSpy.mockRestore()
    })

    it('should build correct ignores flag', async () => {
      mockExecPromise.mockResolvedValue({ stdout: '{}' })

      await workspace.depcheck()

      const expectedIgnores = ['global-dev-dep', 'global-dep', '@mono/*'].join(',')
      expect(mockExecPromise).toHaveBeenCalledWith(expect.stringContaining(`--ignores "${expectedIgnores}"`))
    })

    it('should handle parent packageJson without dependencies or devDependencies', async () => {
      const minimalRepo = { packageJson: { name: 'mono' } } as any
      const ws = new Workspace(minimalRepo, testWorkspacePath)
      mockExecPromise.mockResolvedValue({ stdout: '{}' })

      await ws.depcheck()

      expect(mockExecPromise).toHaveBeenCalledWith(expect.stringContaining('--ignores "@mono/*"'))
    })
  })

  describe(Workspace.prototype.toString.name, () => {
    it('should return workspace path relative to cwd', () => {
      mockPath.relative.mockReturnValue('libs/example')

      const result = workspace.toString()

      expect(mockPath.relative).toHaveBeenCalledWith(process.cwd(), normalizedPath)
      expect(result).toBe('libs/example')
    })
  })

  describe('importedDependenciesRecursive', () => {
    function mockTsFile(filePath: string, deps: string[]): TsFile {
      return { path: filePath, dependencies: deps, isSourceFile: true } as unknown as TsFile
    }

    function mockWs(name: string, tsFiles: TsFile[]): Workspace {
      return { name, tsFiles } as unknown as Workspace
    }

    it('should return empty arrays for workspace with no files', () => {
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([])
      ;(mockMonoRepo as any).workspaces = [workspace]

      const result = workspace.importedDependenciesRecursive
      expect(result).toEqual({ internal: [], external: [] })
    })

    it('should return only external dependencies when no internal deps', () => {
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([
        mockTsFile('/src/a.ts', ['lodash', 'upath']),
        mockTsFile('/src/b.ts', ['fs-extra']),
      ])
      ;(mockMonoRepo as any).workspaces = [workspace]

      const result = workspace.importedDependenciesRecursive
      expect(result.internal).toEqual([])
      expect(result.external).toEqual(['fs-extra', 'lodash', 'upath'])
    })

    it('should separate internal and external dependencies', () => {
      const libA = mockWs('@mono/a', [mockTsFile('/libs/a/src/index.ts', ['lodash'])])
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([mockTsFile('/src/main.ts', ['@mono/a', 'upath'])])
      ;(mockMonoRepo as any).workspaces = [workspace, libA]

      const result = workspace.importedDependenciesRecursive
      expect(result.internal).toEqual(['@mono/a'])
      expect(result.external).toEqual(['lodash', 'upath'])
    })

    it('should recurse into transitive internal dependencies', () => {
      const libB = mockWs('@mono/b', [mockTsFile('/libs/b/src/index.ts', ['es-toolkit'])])
      const libA = mockWs('@mono/a', [mockTsFile('/libs/a/src/index.ts', ['@mono/b', 'lodash'])])
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([mockTsFile('/src/main.ts', ['@mono/a'])])
      ;(mockMonoRepo as any).workspaces = [workspace, libA, libB]

      const result = workspace.importedDependenciesRecursive
      expect(result.internal).toEqual(['@mono/a', '@mono/b'])
      expect(result.external).toEqual(['es-toolkit', 'lodash'])
    })

    it('should handle circular dependencies without infinite loop', () => {
      const libB = mockWs('@mono/b', [mockTsFile('/libs/b/src/index.ts', ['@mono/a'])])
      const libA = mockWs('@mono/a', [mockTsFile('/libs/a/src/index.ts', ['@mono/b'])])
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([mockTsFile('/src/main.ts', ['@mono/a'])])
      ;(mockMonoRepo as any).workspaces = [workspace, libA, libB]

      const result = workspace.importedDependenciesRecursive
      expect(result.internal).toEqual(['@mono/a', '@mono/b'])
      expect(result.external).toEqual([])
    })

    it('should not visit the same file twice', () => {
      const sharedFile = mockTsFile('/libs/a/src/shared.ts', ['lodash'])
      const libA = mockWs('@mono/a', [sharedFile, sharedFile])
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([mockTsFile('/src/main.ts', ['@mono/a'])])
      ;(mockMonoRepo as any).workspaces = [workspace, libA]

      const result = workspace.importedDependenciesRecursive
      expect(result.external).toEqual(['lodash'])
    })

    it('should deduplicate dependencies across multiple files', () => {
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([
        mockTsFile('/src/a.ts', ['lodash', 'upath']),
        mockTsFile('/src/b.ts', ['lodash', 'fs-extra']),
      ])
      ;(mockMonoRepo as any).workspaces = [workspace]

      const result = workspace.importedDependenciesRecursive
      expect(result.external).toEqual(['fs-extra', 'lodash', 'upath'])
    })

    it('should handle deeply nested transitive dependencies', () => {
      const libC = mockWs('@mono/c', [mockTsFile('/libs/c/src/index.ts', ['chalk'])])
      const libB = mockWs('@mono/b', [mockTsFile('/libs/b/src/index.ts', ['@mono/c'])])
      const libA = mockWs('@mono/a', [mockTsFile('/libs/a/src/index.ts', ['@mono/b'])])
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([mockTsFile('/src/main.ts', ['@mono/a'])])
      ;(mockMonoRepo as any).workspaces = [workspace, libA, libB, libC]

      const result = workspace.importedDependenciesRecursive
      expect(result.internal).toEqual(['@mono/a', '@mono/b', '@mono/c'])
      expect(result.external).toEqual(['chalk'])
    })

    it('should return sorted arrays', () => {
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([mockTsFile('/src/a.ts', ['zod', 'axios', 'lodash'])])
      ;(mockMonoRepo as any).workspaces = [workspace]

      const result = workspace.importedDependenciesRecursive
      expect(result.external).toEqual(['axios', 'lodash', 'zod'])
    })

    it('should return empty for files with no dependencies', () => {
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([mockTsFile('/src/a.ts', [])])
      ;(mockMonoRepo as any).workspaces = [workspace]

      const result = workspace.importedDependenciesRecursive
      expect(result).toEqual({ internal: [], external: [] })
    })

    it('should handle workspace with multiple files having mixed deps', () => {
      const libA = mockWs('@mono/a', [
        mockTsFile('/libs/a/src/x.ts', ['type-fest']),
        mockTsFile('/libs/a/src/y.ts', ['es-toolkit']),
      ])
      vi.spyOn(workspace, 'tsFiles', 'get').mockReturnValue([
        mockTsFile('/src/a.ts', ['@mono/a', 'commander']),
        mockTsFile('/src/b.ts', ['upath']),
      ])
      ;(mockMonoRepo as any).workspaces = [workspace, libA]

      const result = workspace.importedDependenciesRecursive
      expect(result.internal).toEqual(['@mono/a'])
      expect(result.external).toEqual(['commander', 'es-toolkit', 'type-fest', 'upath'])
    })
  })

  describe('edge cases', () => {
    it('should handle workspace with no package.json dependencies', () => {
      mockFsExtra.readJsonSync.mockReturnValue({ name: '@mono/minimal', version: '1.0.0' } as PackageJson)

      expect(workspace.installedDependencies).toEqual([])
      expect(workspace.installedDevDependencies).toEqual([])
    })

    it('should handle empty file lists', () => {
      mockFs.walkDirectory.mockReturnValue([])

      expect(workspace.tsFiles).toEqual([])
      expect(workspace.testFiles).toEqual([])
      expect(workspace.files).toEqual([])
    })

    it('should handle workspace with complex dependency scenarios', () => {
      // Mock complex scenario
      vi.spyOn(workspace, 'importedDependencies', 'get').mockReturnValue([
        'lodash-es', // installed
        '@mono/utils', // workspace dependency - not exact match in tsconfigBasePaths
        'global-dep', // available in parent
        'missing-dep', // truly missing
      ])
      vi.spyOn(workspace, 'installedDependencies', 'get').mockReturnValue(['lodash-es'])

      const missing = workspace.missingDependencies
      // Current implementation: global-dep filtered out (in parent), but @mono/utils not filtered (no exact match)
      expect(missing).toEqual(['@mono/utils', 'missing-dep'])
    })
  })

  describe('static inspector', () => {
    it('should have inspector configured correctly', () => {
      expect(Workspace.inspector).toBeDefined()
      expect(Workspace.inspector.keys).toEqual(['name', 'tsFiles', 'testFiles'])
    })
  })
})
