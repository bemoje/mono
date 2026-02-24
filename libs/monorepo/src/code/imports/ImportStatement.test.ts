import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { ImportStatement } from './ImportStatement'
import { TsCode } from '../TsCode'

function getImportStatement(code: string) {
  const tsCode = new TsCode({} as any, code)
  return tsCode.imports[0]
}

describe(ImportStatement.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(ImportStatement.inspector).toBeDefined()
    })
  })

  describe(ImportStatement.prototype.toOneLine.name, () => {
    it('should convert a single-line import to a one-liner', () => {
      const stmt = getImportStatement("import { Foo } from 'bar'")
      expect(stmt.toOneLine()).toBe("import { Foo } from 'bar'")
    })

    it('should convert a multi-line import to a one-liner', () => {
      const code = ['import {', '  Foo,', '  Bar,', "} from 'baz'"].join('\n')
      const stmt = getImportStatement(code)
      const result = stmt.toOneLine()
      expect(result).toBe("import { Foo, Bar } from 'baz'")
    })

    it('should remove trailing commas before closing brace', () => {
      const stmt = getImportStatement("import { Foo,  } from 'bar'")
      const result = stmt.toOneLine()
      expect(result).toBe("import { Foo } from 'bar'")
    })
  })

  describe('keywords', () => {
    it('should return ImportKeywords instance for a regular import', () => {
      const stmt = getImportStatement("import { Foo } from 'bar'")
      expect(stmt.keywords).toBeDefined()
      expect(stmt.keywords.code).toBe('import')
    })

    it('should return ImportKeywords instance for a type import', () => {
      const stmt = getImportStatement("import type { Foo } from 'bar'")
      expect(stmt.keywords).toBeDefined()
    })
  })

  describe(ImportStatement.prototype.split.name, () => {
    it('should split named imports into individual import statements', () => {
      const stmt = getImportStatement("import { Foo, Bar } from 'baz'")
      const result = stmt.split()
      expect(result).toEqual(["import { Foo } from 'baz'", "import { Bar } from 'baz'"])
    })

    it('should return the import as-is for default imports', () => {
      const stmt = getImportStatement("import Foo from 'bar'")
      const result = stmt.split()
      expect(result).toEqual(["import Foo from 'bar'"])
    })

    it('should return the import as-is for side-effect imports', () => {
      const stmt = getImportStatement("import 'bar'")
      const result = stmt.split()
      expect(result).toEqual(["import 'bar'"])
    })
  })

  describe('filepath', () => {
    it('should throw when no TsFile ancestor exists', () => {
      const stmt = getImportStatement("import { Foo } from 'bar'")
      expect(() => stmt.filepath).toThrow()
    })
  })

  describe('specifiers', () => {
    it('should return undefined for side-effect imports', () => {
      const stmt = getImportStatement("import 'bar'")
      expect(stmt.specifiers).toBeUndefined()
    })

    it('should return ImportSpecifiers instance for named imports', () => {
      const stmt = getImportStatement("import { Foo } from 'bar'")
      expect(stmt.specifiers).toBeDefined()
    })
  })

  describe('module', () => {
    it('should return ModuleSpecifier instance', () => {
      const stmt = getImportStatement("import { Foo } from 'bar'")
      expect(stmt.module).toBeDefined()
    })
  })
})
