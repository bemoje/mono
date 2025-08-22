import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { importStatementToOneLiner } from './importStatementToOneLiner'

describe(importStatementToOneLiner.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic single line import
      const singleLine = "import { foo } from 'bar'"
      const result1 = importStatementToOneLiner(singleLine)
      assert.strictEqual(result1, "import { foo } from 'bar'")

      // Multi-line import with extra spaces
      const multiLine = `import {
        foo,
        bar
      } from 'module'`
      const result2 = importStatementToOneLiner(multiLine)
      assert.strictEqual(result2, "import { foo, bar } from 'module'")

      // Import with comments
      const withComments = `import { /* comment */ foo } from 'bar'`
      const result3 = importStatementToOneLiner(withComments)
      assert.strictEqual(result3, "import { foo } from 'bar'")

      // CRLF line endings
      const crlfImport = "import {\r\n  foo\r\n} from 'bar'"
      const result4 = importStatementToOneLiner(crlfImport)
      assert.strictEqual(result4, "import { foo } from 'bar'")
    }).not.toThrow()
  })

  describe('single line imports', () => {
    it('should return unchanged single line imports', () => {
      const input = "import { foo } from 'bar'"
      expect(importStatementToOneLiner(input)).toBe(input)
    })

    it('should handle default imports', () => {
      const input = "import foo from 'bar'"
      expect(importStatementToOneLiner(input)).toBe(input)
    })
  })

  describe('multi-line imports', () => {
    it('should convert multi-line imports to single line', () => {
      const input = `import {
        foo,
        bar
      } from 'module'`
      const expected = "import { foo, bar } from 'module'"
      expect(importStatementToOneLiner(input)).toBe(expected)
    })

    it('should handle extra whitespace', () => {
      const input = `import {
        foo   ,
        bar
      } from 'module'`
      const expected = "import { foo, bar } from 'module'"
      expect(importStatementToOneLiner(input)).toBe(expected)
    })
  })

  describe('comment removal', () => {
    it('should remove single line comments', () => {
      const input = "import { foo /* comment */ } from 'bar'"
      const expected = "import { foo } from 'bar'"
      expect(importStatementToOneLiner(input)).toBe(expected)
    })

    it('should remove multi-line comments', () => {
      const input = `import {
        foo, /* multi
        line comment */
        bar
      } from 'module'`
      const expected = "import { foo, bar } from 'module'"
      expect(importStatementToOneLiner(input)).toBe(expected)
    })
  })

  describe('line ending conversion', () => {
    it('should handle CRLF line endings', () => {
      const input = "import {\r\n  foo\r\n} from 'bar'"
      const expected = "import { foo } from 'bar'"
      expect(importStatementToOneLiner(input)).toBe(expected)
    })

    it('should handle LF line endings', () => {
      const input = "import {\n  foo\n} from 'bar'"
      const expected = "import { foo } from 'bar'"
      expect(importStatementToOneLiner(input)).toBe(expected)
    })
  })
})
