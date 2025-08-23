import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { parseImportStatement } from './parseImportStatement'

describe(parseImportStatement.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic named import
      const named = parseImportStatement("import { foo, bar } from 'lodash'")
      assert.strictEqual(named.type, 'named')
      assert.strictEqual(named.modulePath.type, 'package')
      assert.deepStrictEqual(named.getNames(), ['foo', 'bar'])

      // Default import
      const defaultImport = parseImportStatement("import React from 'react'")
      assert.strictEqual(defaultImport.type, 'default')
      assert.deepStrictEqual(defaultImport.getNames(), ['React'])

      // Namespace import
      const namespace = parseImportStatement("import * as utils from 'lodash'")
      assert.strictEqual(namespace.type, 'namespace')
      assert.strictEqual(namespace.modulePath.type, 'package')
      assert.deepStrictEqual(namespace.getNames(), ['utils'])

      // Side effect import
      const sideEffect = parseImportStatement("import 'styles.css'")
      assert.strictEqual(sideEffect.type, 'sideEffect')
      assert.deepStrictEqual(sideEffect.getNames(), [])

      // Type import
      const typeImport = parseImportStatement("import type { User } from './types'")
      assert.strictEqual(typeImport.keywords.hasTypeKeyword, true)
      assert.strictEqual(typeImport.modulePath.type, 'relative')
    }).not.toThrow()
  })

  describe('import statement types', () => {
    it('should correctly identify side effect imports', () => {
      const result = parseImportStatement("import 'lodash'")
      expect(result.type).toBe('sideEffect')
      expect(result.specifiers.children).toHaveLength(0)
      expect(result.getNames()).toEqual([])
    })

    it('should correctly identify default imports', () => {
      const result = parseImportStatement("import foo from 'lodash'")
      expect(result.type).toBe('default')
      expect(result.specifiers.children).toHaveLength(1)
      expect(result.specifiers.children[0].type).toBe('default')
      expect(result.getNames()).toEqual(['foo'])
    })

    it('should correctly identify namespace imports', () => {
      const result = parseImportStatement("import * as foo from 'lodash'")
      expect(result.type).toBe('namespace')
      expect(result.specifiers.children).toHaveLength(1)
      expect(result.specifiers.children[0].type).toBe('namespace')
      expect(result.getNames()).toEqual(['foo'])
    })

    it('should correctly identify named imports', () => {
      const result = parseImportStatement("import { foo, bar } from 'lodash'")
      expect(result.type).toBe('named')
      expect(result.specifiers.children).toHaveLength(2)
      expect(result.specifiers.children[0].type).toBe('named')
      expect(result.specifiers.children[1].type).toBe('named')
      expect(result.getNames()).toEqual(['foo', 'bar'])
    })

    it('should correctly identify mixed imports', () => {
      const result = parseImportStatement("import React, { useState } from 'react'")
      expect(result.type).toBe('mixed')
      expect(result.specifiers.children).toHaveLength(2)
      expect(result.specifiers.children[0].type).toBe('default')
      expect(result.specifiers.children[1].type).toBe('named')
      expect(result.getNames()).toEqual(['React', 'useState'])
    })
  })

  describe('module path types', () => {
    it('should correctly identify package imports', () => {
      const result = parseImportStatement("import foo from 'lodash'")
      expect(result.modulePath.type).toBe('package')
      expect(result.modulePath.path).toBe('lodash')
    })

    it('should correctly identify relative imports', () => {
      const result = parseImportStatement("import foo from './module'")
      expect(result.modulePath.type).toBe('relative')
      expect(result.modulePath.path).toBe('./module')
    })

    it('should correctly identify relative imports with parent directory', () => {
      const result = parseImportStatement("import foo from '../module'")
      expect(result.modulePath.type).toBe('relative')
      expect(result.modulePath.path).toBe('../module')
    })

    it('should correctly identify builtin modules', () => {
      const result = parseImportStatement("import fs from 'fs'")
      expect(result.modulePath.type).toBe('builtin')
      expect(result.modulePath.path).toBe('fs')
    })

    it('should correctly identify node: prefixed builtin modules', () => {
      const result = parseImportStatement("import fs from 'node:fs'")
      expect(result.modulePath.type).toBe('builtin')
      expect(result.modulePath.path).toBe('node:fs')
    })

    it('should correctly identify absolute imports', () => {
      const result = parseImportStatement("import foo from '/absolute/path/module'")
      expect(result.modulePath.type).toBe('absolute')
      expect(result.modulePath.path).toBe('/absolute/path/module')
    })
  })

  describe('quote types', () => {
    it('should handle single quotes', () => {
      const result = parseImportStatement("import foo from 'node:module'")
      expect(result.modulePath.quote).toBe("'")
    })

    it('should handle double quotes', () => {
      const result = parseImportStatement('import foo from "module"')
      expect(result.modulePath.quote).toBe('"')
    })

    it('should handle backticks', () => {
      const result = parseImportStatement('import foo from `module`')
      expect(result.modulePath.quote).toBe('`')
    })
  })

  describe('type imports', () => {
    it('should handle type-only imports with type keyword', () => {
      const result = parseImportStatement("import type { User } from './types'")
      expect(result.keywords.hasTypeKeyword).toBe(true)
      expect(result.specifiers.children[0].isType).toBe(true)
      expect(result.specifiers.children[0].name).toBe('type User')
    })

    it('should handle mixed type and value imports', () => {
      const result = parseImportStatement("import { type User, getData } from './module'")
      expect(result.keywords.hasTypeKeyword).toBe(false)
      expect(result.specifiers.children[0].isType).toBe(true)
      expect(result.specifiers.children[1].isType).toBe(false)
      expect(result.specifiers.children[0].name).toBe('type User')
      expect(result.specifiers.children[1].name).toBe('getData')
    })

    it('should handle type default imports', () => {
      const result = parseImportStatement("import type User from './types'")
      expect(result.keywords.hasTypeKeyword).toBe(true)
      expect(result.specifiers.children[0].isType).toBe(true)
    })

    it('should handle type namespace imports', () => {
      const result = parseImportStatement("import type * as Types from './types'")
      expect(result.keywords.hasTypeKeyword).toBe(true)
      expect(result.specifiers.children[0].isType).toBe(true)
    })
  })

  describe('named imports with aliases', () => {
    it('should handle named imports with as aliases', () => {
      const result = parseImportStatement("import { foo as bar, baz } from 'lodash'")
      expect(result.specifiers.children).toHaveLength(2)
      expect(result.specifiers.children[0].code).toBe('foo as bar')
      expect(result.specifiers.children[0].name).toBe('foo')
      expect(result.specifiers.children[1].code).toBe('baz')
      expect(result.specifiers.children[1].name).toBe('baz')
      expect(result.getNames()).toEqual(['bar', 'baz'])
    })

    it('should handle getNames with unaliasNamedImports option', () => {
      const result = parseImportStatement("import { foo as bar, baz } from 'lodash'")
      expect(result.getNames({ unaliasNamedImports: true })).toEqual(['foo', 'baz'])
    })

    it('should handle type imports with aliases', () => {
      const result = parseImportStatement("import { type User as U, getData } from './module'")
      expect(result.specifiers.children[0].code).toBe('type User as U')
      expect(result.specifiers.children[0].name).toBe('type User')
      expect(result.getNames()).toEqual(['type U', 'getData'])
    })
  })

  describe('semicolons', () => {
    it('should handle imports with semicolons', () => {
      const result = parseImportStatement("import foo from 'lodash';")
      expect(result.semi).toBe(';')
    })

    it('should handle imports without semicolons', () => {
      const result = parseImportStatement("import foo from 'lodash'")
      expect(result.semi).toBe('')
    })
  })

  describe('complex import statements', () => {
    it('should handle mixed imports with aliases', () => {
      const result = parseImportStatement("import React, { useState as state, useEffect } from 'react'")
      expect(result.type).toBe('mixed')
      expect(result.specifiers.children).toHaveLength(3)
      expect(result.specifiers.children[0].type).toBe('default')
      expect(result.specifiers.children[1].type).toBe('named')
      expect(result.specifiers.children[2].type).toBe('named')
      expect(result.getNames()).toEqual(['React', 'state', 'useEffect'])
    })

    it('should handle namespace imports with aliases', () => {
      const result = parseImportStatement("import * as utils from './utils'")
      expect(result.type).toBe('namespace')
      expect(result.specifiers.children[0].name).toBe('utils')
      expect(result.getNames()).toEqual(['utils'])
    })

    it('should handle multi-line formatted imports', () => {
      const multiline = `import {
        foo,
        bar as baz
      } from 'lodash'`
      const result = parseImportStatement(multiline)
      expect(result.type).toBe('named')
      expect(result.specifiers.children).toHaveLength(2)
      expect(result.getNames()).toEqual(['foo', 'baz'])
    })
  })

  describe('splitBySpecifier method', () => {
    it('should return single import for side effect imports', () => {
      const result = parseImportStatement("import 'lodash'")
      const split = result.splitBySpecifier()
      expect(split).toHaveLength(1)
      expect(split[0].type).toBe('sideEffect')
    })

    it('should split named imports into individual imports', () => {
      const result = parseImportStatement("import { foo, bar } from 'lodash'")
      const split = result.splitBySpecifier()
      expect(split).toHaveLength(2)
      expect(split[0].specifiers.children[0].code).toBe('foo')
      expect(split[1].specifiers.children[0].code).toBe('bar')
    })

    it('should split mixed imports correctly', () => {
      const result = parseImportStatement("import React, { useState } from 'react'")
      const split = result.splitBySpecifier()
      expect(split).toHaveLength(2)
      expect(split[0].type).toBe('default')
      expect(split[1].type).toBe('named')
    })

    it('should handle unaliasNamedImports option', () => {
      const result = parseImportStatement("import { foo as bar } from 'lodash'")
      const split = result.splitBySpecifier({ unaliasNamedImports: true })
      expect(split).toHaveLength(1)
      expect(split[0].specifiers.children[0].code).toBe('foo')
    })

    it('should handle type imports in split', () => {
      const result = parseImportStatement("import { type User, getData } from './module'")
      const split = result.splitBySpecifier()
      expect(split).toHaveLength(2)
      expect(split[0].specifiers.children[0].isType).toBe(true)
      expect(split[1].specifiers.children[0].isType).toBe(false)
    })
  })

  describe('keywords parsing', () => {
    it('should parse import keywords correctly', () => {
      const result = parseImportStatement("import foo from 'lodash'")
      expect(result.keywords.code).toBe('import ')
      expect(result.keywords.keywords).toEqual(['import'])
      expect(result.keywords.hasTypeKeyword).toBe(false)
    })

    it('should parse type import keywords correctly', () => {
      const result = parseImportStatement("import type { User } from 'lodash'")
      expect(result.keywords.code).toBe('import type ')
      expect(result.keywords.keywords).toEqual(['import', 'type'])
      expect(result.keywords.hasTypeKeyword).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle empty named import braces', () => {
      const result = parseImportStatement("import {} from 'lodash'")
      expect(result.type).toBe('sideEffect')
      expect(result.specifiers.children).toHaveLength(0)
    })

    it('should handle whitespace in various places', () => {
      const result = parseImportStatement("import  {  foo  ,  bar  }  from  'lodash'  ")
      expect(result.type).toBe('named')
      expect(result.specifiers.children).toHaveLength(2)
      expect(result.getNames()).toEqual(['foo', 'bar'])
    })

    it('should handle complex paths with special characters', () => {
      const result = parseImportStatement("import foo from '@scope/package-name/sub-path'")
      expect(result.modulePath.type).toBe('package')
      expect(result.modulePath.path).toBe('@scope/package-name/sub-path')
    })

    it('should handle imports with file extensions', () => {
      const result = parseImportStatement("import foo from './module.js'")
      expect(result.modulePath.type).toBe('relative')
      expect(result.modulePath.path).toBe('./module.js')
    })
  })

  describe('parser instance properties', () => {
    it('should preserve original code', () => {
      const code = "import { foo } from 'lodash'"
      const result = parseImportStatement(code)
      expect(result.code).toBe(code)
    })

    it('should provide oneliner format', () => {
      const multiline = `import {
        foo,
        bar
      } from 'lodash'`
      const result = parseImportStatement(multiline)
      expect(result.oneliner).toBe("import { foo, bar } from 'lodash'")
    })

    it('should provide correct module path information', () => {
      const result = parseImportStatement("import foo from 'lodash'")
      expect(result.modulePath.code).toBe("from 'lodash'")
      expect(result.modulePath.quote).toBe("'")
      expect(result.modulePath.path).toBe('lodash')
      expect(result.modulePath.type).toBe('package')
    })
  })
})
