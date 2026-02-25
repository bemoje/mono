import { TsCode } from './TsCode'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

function createTsCode(code: string) {
  return new TsCode({} as any, code)
}

describe(TsCode.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(TsCode.inspector).toBeDefined()
    })
  })

  describe('code', () => {
    it('should return the code string', () => {
      const tsCode = createTsCode('const x = 1')
      expect(tsCode.code).toBe('const x = 1')
    })
  })

  describe('toString', () => {
    it('should return the code string', () => {
      const tsCode = createTsCode('const x = 1')
      expect(tsCode.toString()).toBe('const x = 1')
    })
  })

  describe('imports', () => {
    it('should create ImportStatement objects for each import', () => {
      const code = "import { foo } from './foo'\nimport { bar } from './bar'"
      const tsCode = createTsCode(code)
      const imports = tsCode.imports
      expect(imports).toHaveLength(2)
    })

    it('should return empty array when no imports exist', () => {
      const tsCode = createTsCode('const a = 1')
      expect(tsCode.imports).toEqual([])
    })
  })

  describe('dependencies', () => {
    it('should filter and sort dependency names from imports', () => {
      const tsCode = createTsCode('const a = 1')
      expect(tsCode.dependencies).toEqual([])
    })
  })

  describe(TsCode.prototype.requires.name, () => {
    it('should return module names for requires with default format', () => {
      const code = ["const a = require('module-a')", "const b = require('module-b')"].join('\n')
      const tsCode = createTsCode(code)
      const result = tsCode.requires()
      expect(result).toEqual(['module-a', 'module-b'])
    })

    it('should return module names for format "modules"', () => {
      const code = "const a = require('my-module')"
      const tsCode = createTsCode(code)
      expect(tsCode.requires('modules')).toEqual(['my-module'])
    })

    it('should return lines containing require for format "lines"', () => {
      const code = ["const a = require('module-a')", 'const b = 42', "const c = require('module-c')"].join('\n')
      const tsCode = createTsCode(code)
      const result = tsCode.requires('lines')
      expect(result).toHaveLength(2)
      expect(result[0]).toContain("require('module-a')")
      expect(result[1]).toContain("require('module-c')")
    })

    it('should deduplicate module names', () => {
      const code = ["const a = require('same-module')", "const b = require('same-module')"].join('\n')
      const tsCode = createTsCode(code)
      expect(tsCode.requires()).toEqual(['same-module'])
    })

    it('should return empty array when no requires exist', () => {
      const tsCode = createTsCode('const a = 1')
      expect(tsCode.requires()).toEqual([])
    })
  })

  describe('exportedClassNames', () => {
    it('should extract exported class names', () => {
      const code = ['export class Foo {}', 'export class Bar {}'].join('\n')
      const tsCode = createTsCode(code)
      expect(tsCode.exportedClassNames).toEqual(['Foo', 'Bar'])
    })

    it('should extract exported abstract class names', () => {
      const code = 'export abstract class AbstractWidget {}'
      const tsCode = createTsCode(code)
      expect(tsCode.exportedClassNames).toEqual(['AbstractWidget'])
    })

    it('should ignore non-exported classes', () => {
      const code = ['class Internal {}', 'export class Public {}'].join('\n')
      const tsCode = createTsCode(code)
      expect(tsCode.exportedClassNames).toEqual(['Public'])
    })

    it('should return empty array when no classes exist', () => {
      const tsCode = createTsCode('const a = 1')
      expect(tsCode.exportedClassNames).toEqual([])
    })
  })
})
