import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { importStatementStripKeywords } from './importStatementStripKeywords'

describe(importStatementStripKeywords.name, () => {
  it('examples', () => {
    expect(() => {
      const result1 = importStatementStripKeywords('import { foo } from "bar"')

      const result2 = importStatementStripKeywords('import type { foo } from "bar"')
    }).not.toThrow()
  })

  it('should strip import keyword from regular imports', () => {
    const result = importStatementStripKeywords('import { foo } from "bar"')
    expect(result).toBe('{ foo } from "bar"')
  })

  it('should strip import type keywords from type imports', () => {
    const result = importStatementStripKeywords('import type { foo } from "bar"')
    expect(result).toBe('{ foo } from "bar"')
  })

  it('should handle multiple spaces', () => {
    const result = importStatementStripKeywords('import   type   { foo } from "bar"')
    expect(result).toBe('{ foo } from "bar"')
  })

  it('should return unchanged for non-import lines', () => {
    const line = 'const foo = "bar"'
    const result = importStatementStripKeywords(line)
    expect(result).toBe(line)
  })
})
