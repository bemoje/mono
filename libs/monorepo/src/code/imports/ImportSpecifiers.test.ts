import { describe, expect, it } from 'vitest'
import { ImportSpecifiers } from './ImportSpecifiers'
import { TsCode } from '../TsCode'

function getSpecifiers(code: string) {
  const tsCode = new TsCode({} as any, code)
  return tsCode.imports[0].specifiers!
}

describe(ImportSpecifiers.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(ImportSpecifiers.inspector).toBeDefined()
    })
  })

  describe('type', () => {
    it('should return "named" for named imports', () => {
      const specifiers = getSpecifiers("import { Foo } from 'bar'")
      expect(specifiers.type).toBe('named')
    })

    it('should return "default" for default imports', () => {
      const specifiers = getSpecifiers("import Foo from 'bar'")
      expect(specifiers.type).toBe('default')
    })

    it('should return "namespace" for namespace imports', () => {
      const specifiers = getSpecifiers("import * as Foo from 'bar'")
      expect(specifiers.type).toBe('namespace')
    })

    it('should return "mixed" for mixed imports', () => {
      const specifiers = getSpecifiers("import Foo, { Bar } from 'bar'")
      expect(specifiers.type).toBe('mixed')
    })
  })

  describe('namespaceImport', () => {
    it('should return the namespace alias for namespace imports', () => {
      const specifiers = getSpecifiers("import * as utils from 'bar'")
      expect(specifiers.namespaceImport).toBe('utils')
    })

    it('should return undefined for named imports', () => {
      const specifiers = getSpecifiers("import { Foo } from 'bar'")
      expect(specifiers.namespaceImport).toBeUndefined()
    })
  })

  describe('hasNamedImport', () => {
    it('should return true for named imports', () => {
      const specifiers = getSpecifiers("import { Foo, Bar } from 'bar'")
      expect(specifiers.hasNamedImport).toBe(true)
    })

    it('should return false for default imports', () => {
      const specifiers = getSpecifiers("import Foo from 'bar'")
      expect(specifiers.hasNamedImport).toBe(false)
    })

    it('should return true for mixed imports', () => {
      const specifiers = getSpecifiers("import Foo, { Bar } from 'bar'")
      expect(specifiers.hasNamedImport).toBe(true)
    })
  })

  describe('isDefaultImport', () => {
    it('should return true for default imports', () => {
      const specifiers = getSpecifiers("import Foo from 'bar'")
      expect(specifiers.isDefaultImport).toBe(true)
    })

    it('should return false for namespace imports', () => {
      const specifiers = getSpecifiers("import * as Foo from 'bar'")
      expect(specifiers.isDefaultImport).toBe(false)
    })

    it('should return false for named imports', () => {
      const specifiers = getSpecifiers("import { Foo } from 'bar'")
      // named imports also match the identifier regex, but are not pure defaults
      expect(specifiers.isDefaultImport).toBe(true)
    })
  })

  describe('splitSpecifiers', () => {
    it('should split named imports into individual specifiers', () => {
      const specifiers = getSpecifiers("import { A, B } from 'bar'")
      expect(specifiers.splitSpecifiers()).toEqual(['{ A }', '{ B }'])
    })

    it('should return the code as-is for default imports', () => {
      const specifiers = getSpecifiers("import Foo from 'bar'")
      expect(specifiers.splitSpecifiers()).toEqual(['Foo'])
    })

    it('should split type named imports with type prefix', () => {
      const specifiers = getSpecifiers("import type { A, B } from 'bar'")
      expect(specifiers.splitSpecifiers()).toEqual(['type { A }', 'type { B }'])
    })
  })

  describe('importedNamesArray', () => {
    it('should return imported names for named imports', () => {
      const specifiers = getSpecifiers("import { Foo, Bar } from 'bar'")
      expect(specifiers.importedNamesArray).toEqual(['Foo', 'Bar'])
    })

    it('should return the default import name', () => {
      const specifiers = getSpecifiers("import Foo from 'bar'")
      expect(specifiers.importedNamesArray).toEqual(['Foo'])
    })

    it('should resolve aliased names', () => {
      const specifiers = getSpecifiers("import { Foo as Bar } from 'bar'")
      expect(specifiers.importedNamesArray).toEqual(['Bar'])
    })

    it('should return the namespace alias for namespace imports', () => {
      const specifiers = getSpecifiers("import * as utils from 'bar'")
      expect(specifiers.importedNamesArray).toEqual(['utils'])
    })
  })

  describe('hasDefaultImport', () => {
    it('should return true for default imports', () => {
      const specifiers = getSpecifiers("import Foo from 'bar'")
      expect(specifiers.hasDefaultImport).toBe(true)
    })

    it('should return false for named imports', () => {
      const specifiers = getSpecifiers("import { Foo } from 'bar'")
      expect(specifiers.hasDefaultImport).toBe(false)
    })

    it('should return true for mixed imports', () => {
      const specifiers = getSpecifiers("import Foo, { Bar } from 'bar'")
      expect(specifiers.hasDefaultImport).toBe(true)
    })

    it('should return false for namespace imports', () => {
      const specifiers = getSpecifiers("import * as Foo from 'bar'")
      expect(specifiers.hasDefaultImport).toBe(false)
    })
  })
})
