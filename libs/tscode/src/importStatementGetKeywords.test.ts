import { describe } from 'vitest'
import { expect } from 'vitest'
import { importStatementGetKeywords } from './importStatementGetKeywords'
import { it } from 'vitest'

describe(importStatementGetKeywords.name, () => {
  it('examples', () => {
    expect(() => {
      const result1 = importStatementGetKeywords('import { foo } from "bar"')

      const result2 = importStatementGetKeywords('import type { foo } from "bar"')

      const result3 = importStatementGetKeywords('import type   { foo } from "bar"')
    }).not.toThrow()
  })

  it('should return empty array for regular imports', () => {
    const result = importStatementGetKeywords('import { foo } from "bar"')
    expect(result).toEqual([])
  })

  it('should return ["type"] for type imports', () => {
    const result = importStatementGetKeywords('import type { foo } from "bar"')
    expect(result).toEqual(['type'])
  })

  it('should handle multiple spaces between import and type', () => {
    const result = importStatementGetKeywords('import   type   { foo } from "bar"')
    expect(result).toEqual(['type'])
  })

  it('should return empty array for non-import lines', () => {
    const result = importStatementGetKeywords('const foo = "bar"')
    expect(result).toEqual([])
  })
})
