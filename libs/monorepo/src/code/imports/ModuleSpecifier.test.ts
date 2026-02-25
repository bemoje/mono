import { ModuleSpecifier } from './ModuleSpecifier'
import { MonoRepo } from '../../MonoRepo'
import { TsCode } from '../TsCode'
import { Workspace } from '../../repo/Workspace'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

function getModule(code: string) {
  const tsCode = new TsCode({} as any, code)
  return tsCode.imports[0].module
}

describe(ModuleSpecifier.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(ModuleSpecifier.inspector).toBeDefined()
    })
  })

  describe('from', () => {
    it('should return the module specifier string', () => {
      const mod = getModule("import { Foo } from './local'")
      expect(mod.from).toBe('./local')
    })
  })

  describe('dependency', () => {
    it('should return the package name for external packages', () => {
      const mod = getModule("import { Foo } from 'es-toolkit'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'test-mono' } as any
      })
      expect(mod.dependency).toBe('es-toolkit')
    })

    it('should return scoped package name', () => {
      const mod = getModule("import { Foo } from '@scope/pkg'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'test-mono' } as any
      })
      expect(mod.dependency).toBe('@scope/pkg')
    })

    it('should return package name without subpath for deep imports', () => {
      const mod = getModule("import { Foo } from 'es-toolkit/fp'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'test-mono' } as any
      })
      expect(mod.dependency).toBe('es-toolkit')
    })

    it('should return undefined for relative imports', () => {
      const mod = getModule("import { Foo } from './local'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'test-mono' } as any
      })
      expect(mod.dependency).toBeUndefined()
    })

    it('should return undefined for builtin modules', () => {
      const mod = getModule("import { Foo } from 'fs'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'test-mono' } as any
      })
      expect(mod.dependency).toBeUndefined()
    })
  })

  describe('isBuiltin', () => {
    it('should return true for node builtins', () => {
      const mod = getModule("import { readFile } from 'fs'")
      expect(mod.isBuiltin).toBe(true)
    })

    it('should return true for node: prefixed builtins', () => {
      const mod = getModule("import { readFile } from 'node:fs'")
      expect(mod.isBuiltin).toBe(true)
    })

    it('should return false for external packages', () => {
      const mod = getModule("import { Foo } from 'es-toolkit'")
      expect(mod.isBuiltin).toBe(false)
    })
  })

  describe('isScoped', () => {
    it('should return true for scoped packages', () => {
      const mod = getModule("import { Foo } from '@scope/pkg'")
      expect(mod.isScoped).toBe(true)
    })

    it('should return false for unscoped packages', () => {
      const mod = getModule("import { Foo } from 'es-toolkit'")
      expect(mod.isScoped).toBe(false)
    })
  })

  describe('isRepoScoped', () => {
    it('should return true for repo-scoped imports', () => {
      const mod = getModule("import { Foo } from '@mono/array'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'mono' } as any
      })
      expect(mod.isRepoScoped).toBe(true)
    })

    it('should return false for other scoped imports', () => {
      const mod = getModule("import { Foo } from '@other/pkg'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'mono' } as any
      })
      expect(mod.isRepoScoped).toBe(false)
    })
  })

  describe('isRelative', () => {
    it('should return true for relative imports', () => {
      const mod = getModule("import { Foo } from './local'")
      expect(mod.isRelative).toBe(true)
    })

    it('should return false for package imports', () => {
      const mod = getModule("import { Foo } from 'es-toolkit'")
      expect(mod.isRelative).toBe(false)
    })
  })

  describe('isExternal', () => {
    it('should return true for external packages', () => {
      const mod = getModule("import { Foo } from 'es-toolkit'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'mono' } as any
      })
      expect(mod.isExternal).toBe(true)
    })

    it('should return false for builtins', () => {
      const mod = getModule("import { Foo } from 'fs'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'mono' } as any
      })
      expect(mod.isExternal).toBe(false)
    })

    it('should return false for relative imports', () => {
      const mod = getModule("import { Foo } from './local'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'mono' } as any
      })
      expect(mod.isExternal).toBe(false)
    })
  })

  describe('isDependency', () => {
    it('should return true for external packages', () => {
      const mod = getModule("import { Foo } from 'es-toolkit'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'mono' } as any
      })
      expect(mod.isDependency).toBe(true)
    })

    it('should return false for relative imports', () => {
      const mod = getModule("import { Foo } from './local'")
      vi.spyOn(mod, 'getParentDeep').mockImplementation(() => {
        return { name: 'mono' } as any
      })
      expect(mod.isDependency).toBe(false)
    })
  })

  describe('isFromRepoRoot', () => {
    it('should return true for imports starting with /', () => {
      const mod = getModule("import { Foo } from '/root/path'")
      expect(mod.isFromRepoRoot).toBe(true)
    })

    it('should return false for relative imports', () => {
      const mod = getModule("import { Foo } from './local'")
      expect(mod.isFromRepoRoot).toBe(false)
    })

    it('should return false for scoped package imports', () => {
      const mod = getModule("import { Foo } from '@scope/pkg'")
      expect(mod.isFromRepoRoot).toBe(false)
    })
  })

  describe('isOtherRepoWorkspace', () => {
    it('should return true when the module matches another workspace name', () => {
      const mod = getModule("import { Foo } from '@mono/other-lib'")
      const mockWorkspaces = [{ name: '@mono/other-lib' }, { name: '@mono/current' }]
      vi.spyOn(mod, 'getParentDeep').mockImplementation((cls: any) => {
        if (cls === MonoRepo) {
          return { workspaces: mockWorkspaces } as any
        }
        if (cls === Workspace) {
          return { name: '@mono/current' } as any
        }
        throw new Error('Unexpected class')
      })
      expect(mod.isOtherRepoWorkspace).toBe(true)
    })

    it('should return false when the module matches own workspace name', () => {
      const mod = getModule("import { Foo } from '@mono/current'")
      const mockWorkspaces = [{ name: '@mono/other-lib' }, { name: '@mono/current' }]
      vi.spyOn(mod, 'getParentDeep').mockImplementation((cls: any) => {
        if (cls === MonoRepo) {
          return { workspaces: mockWorkspaces } as any
        }
        if (cls === Workspace) {
          return { name: '@mono/current' } as any
        }
        throw new Error('Unexpected class')
      })
      expect(mod.isOtherRepoWorkspace).toBe(false)
    })

    it('should return false for external packages', () => {
      const mod = getModule("import { Foo } from 'es-toolkit'")
      const mockWorkspaces = [{ name: '@mono/other-lib' }]
      vi.spyOn(mod, 'getParentDeep').mockImplementation((cls: any) => {
        if (cls === MonoRepo) {
          return { workspaces: mockWorkspaces } as any
        }
        if (cls === Workspace) {
          return { name: '@mono/current' } as any
        }
        throw new Error('Unexpected class')
      })
      expect(mod.isOtherRepoWorkspace).toBe(false)
    })
  })
})
