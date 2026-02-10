import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@mono/monorepo', () => ({
  MonoRepo: vi.fn(() => ({})),
}))

vi.mock('./internal/topImports', () => ({
  topImports: vi.fn(() => [
    { count: 10, code: "import { a } from 'lib-a'" },
    { count: 5, code: "import { b } from 'lib-b'" },
  ]),
}))

import { mostFrequentImportStatements } from './mostFrequentImportStatements'

describe(mostFrequentImportStatements.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a Command named "mostFrequentImportStatements"', () => {
    const cmd = mostFrequentImportStatements()
    expect(cmd.name()).toBe('mostFrequentImportStatements')
  })

  it('should have alias "mfis"', () => {
    const cmd = mostFrequentImportStatements()
    expect(cmd.aliases()).toContain('mfis')
  })

  it('should log import results when action is invoked', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const cmd = mostFrequentImportStatements()
    cmd.parse([], { from: 'user' })
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
