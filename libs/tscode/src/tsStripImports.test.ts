import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { tsStripImports } from './tsStripImports'

describe(tsStripImports.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic import removal
      const codeWithImports = `import { foo } from 'bar'
import baz from 'qux'

const someCode = 'value'
console.log(someCode)`

      const result = tsStripImports(codeWithImports)

      assert(!result.includes('import'), 'All imports should be removed')
      assert(result.includes("const someCode = 'value'"), 'Non-import code should be preserved')
      assert(result.includes('console.log(someCode)'), 'Non-import code should be preserved')
    }).not.toThrow()
  })

  describe('import removal', () => {
    it('should remove single line imports', () => {
      const code = `import { foo } from 'bar'
import baz from 'qux'

const test = 'value'`

      const result = tsStripImports(code)
      const expected = `\n\n
const test = 'value'`

      expect(result).toBe(expected)
    })

    it('should remove multi-line imports', () => {
      const code = `import {
  foo,
  bar
} from 'module'

const test = 'value'`

      const result = tsStripImports(code)

      expect(result).not.toContain('import')
      expect(result).not.toContain('foo')
      expect(result).not.toContain('bar')
      expect(result).toContain("const test = 'value'")
    })

    it('should handle mixed import types', () => {
      const code = `import defaultExport from 'module1'
import { namedExport } from 'module2'
import * as namespaceExport from 'module3'

function test() {
  return 'hello'
}`

      const result = tsStripImports(code)

      expect(result).not.toContain('import')
      expect(result).not.toContain('defaultExport')
      expect(result).not.toContain('namedExport')
      expect(result).not.toContain('namespaceExport')
      expect(result).toContain('function test()')
    })
  })

  describe('code preservation', () => {
    it('should preserve all non-import code', () => {
      const code = `import { test } from 'test'

const variable = 'value'
function myFunction() {
  return variable
}

class MyClass {
  constructor() {
    this.value = myFunction()
  }
}`

      const result = tsStripImports(code)

      expect(result).toContain("const variable = 'value'")
      expect(result).toContain('function myFunction() {')
      expect(result).toContain('class MyClass {')
      expect(result).toContain('constructor() {')
    })

    it('should handle code that looks like imports but is not', () => {
      const code = `import { real } from 'module'

const str = "import { fake } from 'fake'"
// import { comment } from 'comment'`

      const result = tsStripImports(code)

      expect(result).not.toContain('import { real }')
      expect(result).toContain('import { fake }')
      expect(result).toContain('// import { comment }')
    })
  })

  describe('edge cases', () => {
    it('should handle empty code', () => {
      expect(tsStripImports('')).toBe('')
    })

    it('should handle code without imports', () => {
      const code = `const test = 'value'
console.log(test)`

      expect(tsStripImports(code)).toBe(code)
    })

    it('should handle only imports', () => {
      const code = `import { a } from 'a'
import { b } from 'b'`

      const result = tsStripImports(code)

      expect(result).toBe('\n')
    })

    it('should handle CRLF line endings', () => {
      const code = "import { test } from 'test'\r\n\r\nconst value = 'hello'"

      const result = tsStripImports(code)

      expect(result).not.toContain('import')
      expect(result).toContain("const value = 'hello'")
    })
  })

  describe('with predefined imports', () => {
    it('should use provided imports parameter', () => {
      const code = `import { a } from 'a'
import { b } from 'b'

const test = 'value'`

      const imports = [
        {
          start: 0,
          end: 1,
          match: "import { a } from 'a'",
          matchOneLine: "import { a } from 'a'",
        },
      ]

      const result = tsStripImports(code, imports)

      // Should only remove the import specified in the imports parameter
      expect(result).not.toContain("import { a } from 'a'")
      expect(result).toContain("import { b } from 'b'")
      expect(result).toContain("const test = 'value'")
    })

    it('should handle empty imports array', () => {
      const code = `import { a } from 'a'

const test = 'value'`

      const result = tsStripImports(code, [])

      expect(result).toBe(code)
    })
  })
})
