import { describe } from 'vitest'
import { expect } from 'vitest'
import { importStatementToFormattedOneLiner } from './importStatementToFormattedOneLiner'
import { it } from 'vitest'

describe(importStatementToFormattedOneLiner.name, () => {
  it('examples', () => {
    expect(() => {
      const multilineImport = `import {
  foo,
  bar
} from 'module'`

      const result = importStatementToFormattedOneLiner(multilineImport)
    }).not.toThrow()
  })

  it('should convert multiline import to formatted one-liner', () => {
    const multilineImport = `import {
  foo,
  bar
} from 'module'`

    const result = importStatementToFormattedOneLiner(multilineImport)
    expect(result).toBe("import { foo, bar } from 'module'")
  })

  it('should add proper spacing around braces and from keyword', () => {
    const input = 'import{foo,bar}from"module"'
    const result = importStatementToFormattedOneLiner(input)
    expect(result).toBe('import { foo, bar } from "module"')
  })

  it('should handle default imports', () => {
    const input = 'import foo from "module"'
    const result = importStatementToFormattedOneLiner(input)
    expect(result).toBe('import foo from "module"')
  })

  it('should handle namespace imports', () => {
    const input = 'import*as foo from"module"'
    const result = importStatementToFormattedOneLiner(input)
    expect(result).toBe('import * as foo from "module"')
  })
})
