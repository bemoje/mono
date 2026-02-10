import { describe, expect, it } from 'vitest'
import { ImportKeywords } from './ImportKeywords'
import { TsCode } from '../TsCode'

function getImportStatement(code: string) {
  const tsCode = new TsCode({} as any, code)
  return tsCode.imports[0]
}

describe(ImportKeywords.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(ImportKeywords.inspector).toBeDefined()
    })
  })

  describe('isType', () => {
    it('should return true for type imports', () => {
      const stmt = getImportStatement("import type { Foo } from 'bar'")
      expect(stmt.keywords.isType).toBe(true)
    })

    it('should return false for non-type imports', () => {
      const stmt = getImportStatement("import { Foo } from 'bar'")
      expect(stmt.keywords.isType).toBe(false)
    })
  })
})
