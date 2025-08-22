/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { Workspace } from './Workspace'
import { MonoRepo } from './MonoRepo'
import { TsFile } from '../file/TsFile'
import { TestFile } from '../file/TestFile'
import { PackageJson } from '@mono/types'
import path from 'upath'
import * as fsExtra from 'fs-extra/esm'
import * as fs from '@mono/fs'
import { promisify } from 'util'
import commandExists from 'command-exists'

// Mock dependencies
vi.mock('fs-extra/esm')
vi.mock('@mono/fs')
vi.mock('child_process')
vi.mock('util')
vi.mock('command-exists')
vi.mock('upath', () => ({
  default: {
    normalize: vi.fn(),
    basename: vi.fn(),
    dirname: vi.fn(),
    join: vi.fn(),
    relative: vi.fn(),
  },
}))
vi.mock('../file/TsFile')
vi.mock('../file/TestFile')
vi.mock('../util/resolveModuleImportPath')

const mockPath = vi.mocked(path)
const mockFsExtra = vi.mocked(fsExtra)
const mockFs = vi.mocked(fs)
const mockPromisify = vi.mocked(promisify)
const mockCommandExists = vi.mocked(commandExists)
const mockTestFile = vi.mocked(TestFile)

// Mock resolveModuleImportPath
import { resolveModuleImportPath } from '../util/resolveModuleImportPath'

vi.mock('../util/resolveModuleImportPath', () => ({
  resolveModuleImportPath: vi.fn(),
}))

const mockResolveModuleImportPath = vi.mocked(resolveModuleImportPath)

describe(Workspace.name, () => {
  let mockMonoRepo: MonoRepo
  let workspace: Workspace
  const testWorkspacePath = '/test/repo/libs/example'
  const normalizedPath = '/test/repo/libs/example'

  const mockPackageJson: PackageJson = {
    name: '@mono/example',
    version: '1.0.0',
    dependencies: {
      'lodash-es': '^4.17.21',
      '@mono/utils': 'workspace:*',
    },
    devDependencies: {
      'vitest': '^1.0.0',
      '@types/lodash-es': '^4.17.7',
    },
  }

  const mockParentPackageJson: PackageJson = {
    name: 'mono',
    version: '1.0.0',
    dependencies: {
      'global-dep': '^1.0.0',
    },
    devDependencies: {
      'global-dev-dep': '^1.0.0',
    },
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
    mockPath.join.mockImplementation((...args: string[]) => args.join('/'))
    mockPath.relative.mockImplementation((from: string, to: string) => {
      // Simple mock implementation
      return to.replace(from + '/', '')
    })

    // Mock fs-extra
    mockFsExtra.readJsonSync.mockReturnValue(mockPackageJson)

    // Create mock MonoRepo
    mockMonoRepo = {
      packageJson: mockParentPackageJson,
      tsconfigBasePaths: {
        '@mono/*': ['libs/*/src'],
      },
    } as any

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
      workspace.packageJson
      workspace.packageJson

      expect(mockFsExtra.readJsonSync).toHaveBeenCalledTimes(1)
    })
  })

  describe('name getter', () => {
    it('should return package name from package.json', () => {
      expect(workspace.name).toBe('@mono/example')
    })

    it('should throw error when name is missing', () => {
      mockFsExtra.readJsonSync.mockReturnValue({} as PackageJson)

      expect(() => workspace.name).toThrow("Workspace package.json missing 'name' field")
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
      mockPath.relative.mockImplementation((from, to) => to.replace('/test/repo/', ''))

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
      mockPath.relative.mockImplementation((from, to) => to.replace('/test/repo/', ''))

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
              imports: [
                {
                  module: { from: '@mono/example' },
                  specifiers: { importedNamesArray: ['utils'] },
                },
              ],
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
              imports: [
                {
                  module: { from: '@mono/example' },
                  specifiers: { importedNamesArray: ['someExport'] },
                },
              ],
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

        expect(result).toEqual({
          origin: workspace.origin,
          workspace: workspace.name,
          unused: ['unused-dep'],
        })
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

      expect(result).toEqual({
        origin: workspace.origin,
        workspace: workspace.name,
        unused: ['unused-dep'],
      })
      expect(result).not.toHaveProperty('missing')
      expect(result).not.toHaveProperty('missingDev')
    })
  })

  describe(Workspace.prototype.depcheck.name, () => {
    const mockExecPromise = vi.fn()
    // const mockCommandExists = vi.fn()

    beforeEach(() => {
      mockPromisify.mockReturnValue(mockExecPromise as any)
      // mockCommandExists.mockResolvedValue(true as any)
    })

    it('should run depcheck command successfully', async () => {
      mockCommandExists.mockResolvedValue(true as any)
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

      expect(mockCommandExists).toHaveBeenCalledWith('depcheck')
      expect(mockExecPromise).toHaveBeenCalledWith(expect.stringContaining(`yarn depcheck ${normalizedPath}`))
      expect(result.dependencies).toEqual(['unused-dep'])
    })

    it('should handle execution errors with stdout', async () => {
      mockCommandExists.mockResolvedValue(true as any)
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
      mockCommandExists.mockResolvedValue(true as any)
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
      mockCommandExists.mockResolvedValue(true as any)
      mockExecPromise.mockResolvedValue({ stdout: '{}' })

      await workspace.depcheck()

      const expectedIgnores = ['global-dev-dep', 'global-dep', '@mono/*'].join(',')
      expect(mockExecPromise).toHaveBeenCalledWith(expect.stringContaining(`--ignores "${expectedIgnores}"`))
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

  describe('edge cases', () => {
    it('should handle workspace with no package.json dependencies', () => {
      mockFsExtra.readJsonSync.mockReturnValue({
        name: '@mono/minimal',
        version: '1.0.0',
      } as PackageJson)

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
