import { describe, expect, it, vi } from 'vitest'
import { ModuleSpecifier } from './ModuleSpecifier'
import { TsCode } from '../TsCode'
import { MonoRepo } from '../../MonoRepo'
import { Workspace } from '../../repo/Workspace'

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
        if (cls === MonoRepo) return { workspaces: mockWorkspaces } as any
        if (cls === Workspace) return { name: '@mono/current' } as any
        throw new Error('Unexpected class')
      })
      expect(mod.isOtherRepoWorkspace).toBe(true)
    })

    it('should return false when the module matches own workspace name', () => {
      const mod = getModule("import { Foo } from '@mono/current'")
      const mockWorkspaces = [{ name: '@mono/other-lib' }, { name: '@mono/current' }]
      vi.spyOn(mod, 'getParentDeep').mockImplementation((cls: any) => {
        if (cls === MonoRepo) return { workspaces: mockWorkspaces } as any
        if (cls === Workspace) return { name: '@mono/current' } as any
        throw new Error('Unexpected class')
      })
      expect(mod.isOtherRepoWorkspace).toBe(false)
    })

    it('should return false for external packages', () => {
      const mod = getModule("import { Foo } from 'lodash'")
      const mockWorkspaces = [{ name: '@mono/other-lib' }]
      vi.spyOn(mod, 'getParentDeep').mockImplementation((cls: any) => {
        if (cls === MonoRepo) return { workspaces: mockWorkspaces } as any
        if (cls === Workspace) return { name: '@mono/current' } as any
        throw new Error('Unexpected class')
      })
      expect(mod.isOtherRepoWorkspace).toBe(false)
    })
  })
})
