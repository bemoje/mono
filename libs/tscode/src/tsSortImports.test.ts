import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { tsSortImports } from './tsSortImports'

describe(tsSortImports.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic import sorting
      const unsortedCode = `import { z } from 'z-module'
import { a } from 'a-module'
import { m } from 'm-module'

const someCode = 'value'`

      const result = tsSortImports(unsortedCode)
      const expectedImports = `import { a } from 'a-module'
import { m } from 'm-module'
import { z } from 'z-module'`

      assert(result.includes(expectedImports), 'Imports should be sorted alphabetically')
      assert(result.includes("const someCode = 'value'"), 'Non-import code should be preserved')
    }).not.toThrow()
  })

  describe('import sorting', () => {
    it('should sort imports alphabetically by module specifier', () => {
      const code = `import { foo } from 'zebra'
import { bar } from 'alpha'
import { baz } from 'middle'

const code = 'here'`

      const result = tsSortImports(code)
      const expected = `import { bar } from 'alpha'
import { baz } from 'middle'
import { foo } from 'zebra'

const code = 'here'
`

      expect(result).toBe(expected)
    })

    it('should handle mixed import types', () => {
      const code = `import zebra from 'zebra'
import { alpha } from 'alpha'
import * as middle from 'middle'

console.log('test')`

      const result = tsSortImports(code)
      const lines = result.split('\n')

      expect(lines[0]).toContain('alpha')
      expect(lines[1]).toContain('middle')
      expect(lines[2]).toContain('zebra')
    })
  })

  describe('multi-line imports', () => {
    it('should handle multi-line imports correctly', () => {
      const code = `import {
  z,
  y
} from 'zebra'
import { a } from 'alpha'

const test = 'value'`

      const result = tsSortImports(code)

      expect(result).toContain("import { a } from 'alpha'")
      expect(result).toContain('zebra')
      expect(result).toContain("const test = 'value'")
    })
  })

  describe('code preservation', () => {
    it('should preserve non-import code', () => {
      const code = `import { b } from 'b'
import { a } from 'a'

const variable = 'value'
function test() {
  return 'hello'
}`

      const result = tsSortImports(code)

      expect(result).toContain("const variable = 'value'")
      expect(result).toContain('function test() {')
      expect(result).toContain("return 'hello'")
    })

    it('should maintain proper spacing', () => {
      const code = `import { b } from 'b'
import { a } from 'a'

const code = 'here'`

      const result = tsSortImports(code)

      // Should have exactly one empty line between imports and code
      expect(result).toMatch(/from 'b'\n\nconst code/)
    })
  })

  describe('edge cases', () => {
    it('should handle empty code', () => {
      expect(tsSortImports('')).toBe('\n')
    })

    it('should handle code without imports', () => {
      const code = `const test = 'value'
console.log(test)`

      expect(tsSortImports(code)).toBe(code + '\n')
    })

    it('should handle only imports', () => {
      const code = `import { b } from 'b'
import { a } from 'a'`

      const result = tsSortImports(code)

      expect(result).toContain("import { a } from 'a'")
      expect(result).toContain("import { b } from 'b'")
    })

    it('should handle CRLF line endings', () => {
      const code = "import { b } from 'b'\r\nimport { a } from 'a'\r\n\r\nconst test = 'value'"

      expect(() => tsSortImports(code)).not.toThrow()
    })
  })

  describe('with predefined imports', () => {
    it('should use provided imports parameter', () => {
      const code = `import { b } from 'b'
import { a } from 'a'

const test = 'value'`

      const imports = [
        {
          start: 0,
          end: 1,
          match: "import { b } from 'b'",
          matchOneLine: "import { b } from 'b'",
        },
        {
          start: 1,
          end: 2,
          match: "import { a } from 'a'",
          matchOneLine: "import { a } from 'a'",
        },
      ]

      const result = tsSortImports(code, imports)

      expect(result).toContain("import { a } from 'a'")
      expect(result).toContain("import { b } from 'b'")
      expect(result).toContain("const test = 'value'")
    })
  })
})
