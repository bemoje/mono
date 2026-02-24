import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { importStatementHasTypeKeyword } from './importStatementHasTypeKeyword'

describe(importStatementHasTypeKeyword.name, () => {
  it('examples', () => {
    expect(() => {
      const result1 = importStatementHasTypeKeyword('import { foo } from "bar"')

      const result2 = importStatementHasTypeKeyword('import type { foo } from "bar"')
    }).not.toThrow()
  })

  it('should return false for regular imports', () => {
    const result = importStatementHasTypeKeyword('import { foo } from "bar"')
    expect(result).toBe(false)
  })

  it('should return true for type imports', () => {
    const result = importStatementHasTypeKeyword('import type { foo } from "bar"')
    expect(result).toBe(true)
  })

  it('should return false for lines that do not start with import type', () => {
    const result = importStatementHasTypeKeyword('const type = "bar"')
    expect(result).toBe(false)
  })

  it('should return false for import statements with type elsewhere', () => {
    const result = importStatementHasTypeKeyword('import { type } from "bar"')
    expect(result).toBe(false)
  })
})
