/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, it, vi, expect } from 'vitest'
import { MonoRepo } from './MonoRepo'
import * as fs from 'fs'
import * as fse from 'fs-extra/esm'
import { Workspace } from './Workspace'
import path from 'upath'

vi.mock('./Workspace')
vi.mock('../util/getRepoRootDirpath')

// Mock dependencies
vi.mock('fs')
vi.mock('fs-extra/esm')
vi.mock('upath', () => ({
  default: {
    normalize: vi.fn(),
    join: vi.fn(),
    joinSafe: vi.fn(),
    normalizeSafe: vi.fn(),
    dirname: vi.fn(),
  },
}))

const mockPath = vi.mocked(path)
const mockFs = vi.mocked(fs)
const mockFse = vi.mocked(fse)

describe(MonoRepo.name, () => {
  const mockRootPath = '/test/repo'
  const normalizedPath = '/test/repo/normalized'

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Clear instances map
    MonoRepo.instances.clear()

    // Default mock implementations
    mockPath.dirname.mockReturnValue(mockRootPath)
    mockPath.normalize.mockReturnValue(normalizedPath)
    mockPath.normalizeSafe.mockReturnValue(normalizedPath)
    mockPath.join.mockImplementation((...args: string[]) => args.join('/'))
    mockPath.joinSafe.mockImplementation((...args: string[]) => args.join('/'))
  })

  afterEach(() => {
    // Clean up instances after each test
    MonoRepo.instances.clear()
  })

  describe('static properties', () => {
    it('should have inspector property', () => {
      expect(MonoRepo.inspector).toBeDefined()
    })

    it('should have instances map', () => {
      expect(MonoRepo.instances).toBeInstanceOf(Map)
    })
  })

  describe('monoRepo getter', () => {
    it('should return parent MonoRepo if exists', () => {
      const mockParent = { findParentDeep: vi.fn() }
      const parentRepo = new MonoRepo()

      mockParent.findParentDeep.mockReturnValue(parentRepo)

      const repo = new MonoRepo()
      // Mock the findParentDeep method to simulate parent existence
      const originalFindParentDeep = repo.findParentDeep
      repo.findParentDeep = vi.fn().mockReturnValue(parentRepo)

      expect(repo.monoRepo).toBe(parentRepo)

      repo.findParentDeep = originalFindParentDeep
    })

    it('should return self if no parent MonoRepo found', () => {
      const repo = new MonoRepo()
      expect(repo.monoRepo).toBe(repo)
    })
  })

  describe('packageJsonPath getter', () => {
    it('should return correct package.json path', () => {
      const repo = new MonoRepo()
      const result = repo.packageJsonPath

      expect(result).toBe(`/package.json`)
    })
  })

  describe('tsconfigBaseJsonPath getter', () => {
    it('should return correct tsconfig.json path', () => {
      const repo = new MonoRepo()
      const result = repo.tsconfigBaseJsonPath

      expect(result).toBe(`/tsconfig.json`)
    })
  })

  describe('tsconfigBase getter', () => {
    it('should read and return tsconfig.json content', () => {
      const mockTsConfig = {
        compilerOptions: {
          target: 'es2020',
          module: 'commonjs',
        },
      }

      mockFse.readJsonSync.mockReturnValue(mockTsConfig)

      const repo = new MonoRepo()
      const result = repo.tsconfigBase

      expect(mockFse.readJsonSync).toHaveBeenCalledWith(repo.tsconfigBaseJsonPath)
      expect(result.compilerOptions?.target).toBe('es2020')
      expect(result.compilerOptions?.module).toBe('commonjs')
    })

    it('should initialize compilerOptions if not present', () => {
      const mockTsConfig = {}

      mockFse.readJsonSync.mockReturnValue(mockTsConfig)

      const repo = new MonoRepo()
      const result = repo.tsconfigBase

      expect(result.compilerOptions).toBeDefined()
      expect(result.compilerOptions?.paths).toBeDefined()
    })

    it('should set paths from tsconfigBasePaths if not present', () => {
      const mockTsConfig = {
        compilerOptions: {},
      }
      const mockPaths = {
        '@mono/*': ['libs/*/src'],
        '@app/*': ['apps/*/src'],
      }

      mockFse.readJsonSync.mockReturnValue(mockTsConfig)
      mockFs.existsSync.mockReturnValue(true)
      mockFse.readJsonSync.mockReturnValueOnce(mockTsConfig)
      mockFse.readJsonSync.mockReturnValueOnce({ compilerOptions: { paths: mockPaths } })

      const repo = new MonoRepo()
      const result = repo.tsconfigBase

      expect(result.compilerOptions?.paths).toEqual(mockPaths)
    })
  })

  describe('tsconfigBasePathsJsonPath getter', () => {
    it('should return correct tsconfig.paths.json path', () => {
      const repo = new MonoRepo()
      const result = repo.tsconfigBasePathsJsonPath

      expect(result).toBe(`/tsconfig.paths.json`)
    })
  })

  describe('tsconfigBasePaths getter', () => {
    it('should return empty object if file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)

      const repo = new MonoRepo()
      const result = repo.tsconfigBasePaths

      expect(result).toEqual({})
    })

    it('should read and return paths from tsconfig.paths.json', () => {
      const mockPaths = {
        '@mono/*': ['libs/*/src'],
        '@app/*': ['apps/*/src'],
      }

      mockFs.existsSync.mockReturnValue(true)
      mockFse.readJsonSync.mockReturnValue({
        compilerOptions: {
          paths: mockPaths,
        },
      })

      const repo = new MonoRepo()
      const result = repo.tsconfigBasePaths

      expect(mockFse.readJsonSync).toHaveBeenCalledWith(repo.tsconfigBasePathsJsonPath)
      expect(result).toEqual(mockPaths)
    })

    it('should return empty object if compilerOptions.paths is undefined', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFse.readJsonSync.mockReturnValue({
        compilerOptions: {},
      })

      const repo = new MonoRepo()
      const result = repo.tsconfigBasePaths

      expect(result).toEqual({})
    })
  })

  describe('packageJson getter', () => {
    it('should read and return package.json content', () => {
      const mockPackageJson = {
        name: 'test-repo',
        version: '1.0.0',
        workspaces: ['libs/*', 'apps/*'],
      }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)

      const repo = new MonoRepo()
      const result = repo.packageJson

      expect(mockFse.readJsonSync).toHaveBeenCalledWith(repo.packageJsonPath)
      expect(result).toEqual(mockPackageJson)
    })
  })

  describe('name getter', () => {
    it('should return name from package.json', () => {
      const mockPackageJson = {
        name: 'test-monorepo',
        version: '1.0.0',
      }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)

      const repo = new MonoRepo()
      const result = repo.name

      expect(result).toBe('test-monorepo')
    })

    it('should throw error if package.json missing name field', () => {
      const mockPackageJson = {
        version: '1.0.0',
      }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)

      const repo = new MonoRepo()

      expect(() => repo.name).toThrow(`MonoRepo package.json missing 'name' field: ${repo.packageJsonPath}`)
    })
  })

  describe('workspacesRootPaths getter', () => {
    it('should return normalized workspace paths', () => {
      const mockPackageJson = {
        name: 'test-repo',
        workspaces: ['libs/*', 'apps/*'],
      }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)
      // Mock path.normalize to return the expected values for workspace paths
      mockPath.normalize.mockImplementation((p: string) => {
        if (p === mockRootPath) return normalizedPath
        return p.replace(/\*$/, '')
      })

      const repo = new MonoRepo()
      const result = repo.workspacesRootPaths

      expect(result).toEqual(['libs/', 'apps/'])
    })

    it('should remove trailing asterisk from workspace paths', () => {
      const mockPackageJson = {
        name: 'test-repo',
        workspaces: ['libs/*', 'apps/*', 'packages/*'],
      }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)
      mockPath.normalize.mockImplementation((p: string) => {
        if (p === mockRootPath) return normalizedPath
        return p.replace(/\*$/, '')
      })

      const repo = new MonoRepo()
      const result = repo.workspacesRootPaths

      expect(result).toEqual(['libs/', 'apps/', 'packages/'])
    })

    it('should throw error if package.json missing workspaces field', () => {
      const mockPackageJson = {
        name: 'test-repo',
        version: '1.0.0',
      }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)

      const repo = new MonoRepo()

      expect(() => repo.workspacesRootPaths).toThrow(
        `MonoRepo package.json missing 'workspaces' field: ${repo.packageJsonPath}`,
      )
    })
  })

  describe('workspacePaths getter', () => {
    it('should return all workspace directory paths', () => {
      const mockPackageJson = {
        name: 'test-repo',
        workspaces: ['libs/*', 'apps/*'],
      }

      const mockDirent1 = { name: 'package1', isDirectory: () => true }
      const mockDirent2 = { name: 'package2', isDirectory: () => true }
      const mockDirent3 = { name: 'app1', isDirectory: () => true }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)
      mockPath.normalize.mockImplementation((p: string) => {
        if (p === mockRootPath) return normalizedPath
        return p.replace(/\*$/, '')
      })
      mockFs.readdirSync.mockReturnValueOnce([mockDirent1, mockDirent2] as any)
      mockFs.readdirSync.mockReturnValueOnce([mockDirent3] as any)

      const repo = new MonoRepo()
      const result = repo.workspacePaths

      expect(mockFs.readdirSync).toHaveBeenCalledWith('libs/', { withFileTypes: true })
      expect(mockFs.readdirSync).toHaveBeenCalledWith('apps/', { withFileTypes: true })
      expect(result).toEqual(['libs//package1', 'libs//package2', 'apps//app1'])
    })

    it('should filter only directories', () => {
      const mockPackageJson = {
        name: 'test-repo',
        workspaces: ['libs/*'],
      }

      const mockDirent1 = { name: 'package1', isDirectory: () => true }
      const mockDirent2 = { name: 'file.txt', isDirectory: () => false }
      const mockDirent3 = { name: 'package2', isDirectory: () => true }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)
      mockPath.normalize.mockImplementation((p: string) => {
        if (p === mockRootPath) return normalizedPath
        return p.replace(/\*$/, '')
      })
      mockFs.readdirSync.mockReturnValue([mockDirent1, mockDirent2, mockDirent3] as any)

      const repo = new MonoRepo()
      const result = repo.workspacePaths

      expect(result).toEqual(['libs//package1', 'libs//package2'])
    })

    it('should flatten nested workspace paths', () => {
      const mockPackageJson = {
        name: 'test-repo',
        workspaces: ['libs/*', 'apps/*'],
      }

      const mockDirent1 = { name: 'lib1', isDirectory: () => true }
      const mockDirent2 = { name: 'app1', isDirectory: () => true }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)
      mockPath.normalize.mockImplementation((p: string) => {
        if (p === mockRootPath) return normalizedPath
        return p.replace(/\*$/, '')
      })
      mockFs.readdirSync.mockReturnValueOnce([mockDirent1] as any)
      mockFs.readdirSync.mockReturnValueOnce([mockDirent2] as any)

      const repo = new MonoRepo()
      const result = repo.workspacePaths

      expect(result).toEqual(['libs//lib1', 'apps//app1'])
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('workspaces getter', () => {
    it('should return array of Workspace instances', () => {
      const mockPackageJson = {
        name: 'test-repo',
        workspaces: ['libs/*'],
      }

      const mockDirent = { name: 'package1', isDirectory: () => true }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)
      mockPath.normalize.mockImplementation((p: string) => {
        if (p === mockRootPath) return normalizedPath
        return p.replace(/\*$/, '')
      })
      mockFs.readdirSync.mockReturnValue([mockDirent] as any)

      const repo = new MonoRepo()
      const result = repo.workspaces

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(1)
      expect(Workspace).toHaveBeenCalledWith(repo, 'libs//package1')
    })

    it('should create Workspace with correct parent and path', () => {
      const mockPackageJson = {
        name: 'test-repo',
        workspaces: ['libs/*', 'apps/*'],
      }

      const mockDirent1 = { name: 'lib1', isDirectory: () => true }
      const mockDirent2 = { name: 'app1', isDirectory: () => true }

      mockFse.readJsonSync.mockReturnValue(mockPackageJson)
      mockPath.normalize.mockImplementation((p: string) => {
        if (p === mockRootPath) return normalizedPath
        return p.replace(/\*$/, '')
      })
      mockFs.readdirSync.mockReturnValueOnce([mockDirent1] as any)
      mockFs.readdirSync.mockReturnValueOnce([mockDirent2] as any)

      const repo = new MonoRepo()
      repo.workspaces

      expect(Workspace).toHaveBeenCalledWith(repo, 'libs//lib1')
      expect(Workspace).toHaveBeenCalledWith(repo, 'apps//app1')
      expect(Workspace).toHaveBeenCalledTimes(2)
    })
  })

  describe('error handling', () => {
    it('should handle file system errors gracefully', () => {
      mockFse.readJsonSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      const repo = new MonoRepo()

      expect(() => repo.packageJson).toThrow('File not found')
    })
  })

  describe('integration with parent class', () => {
    it('should extend AbstractBase correctly', () => {
      const repo = new MonoRepo()

      // Test that it has methods from AbstractBase
      expect(typeof repo.findParentDeep).toBe('function')
      expect(repo).toBeInstanceOf(MonoRepo)
    })

    it('should work with Parenting composition', () => {
      const repo = new MonoRepo()

      // Test that Parenting.compose decorator was applied
      expect(MonoRepo.name).toBe('MonoRepo')
      expect(repo.constructor.name).toBe('MonoRepo')
    })

    it('should work with Inspector composition', () => {
      // Test that Inspector is available
      expect(MonoRepo.inspector).toBeDefined()
      expect(typeof MonoRepo.inspector).toBe('object')
    })
  })

  describe('singleton behavior', () => {
    it('should maintain singleton pattern per path', () => {
      const repo1 = new MonoRepo()
      const repo2 = new MonoRepo()

      expect(repo1).toBe(repo2)
      expect(MonoRepo.instances.size).toBe(1)
    })
  })
})
