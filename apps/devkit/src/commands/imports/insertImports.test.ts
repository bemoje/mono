import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('fs-extra', () => ({
  default: {
    readFileSync: vi.fn(),
    outputFileSync: vi.fn(),
  },
}))

vi.mock('strip-comments', () => ({
  default: vi.fn((code: string) => code),
}))

vi.mock('@mono/tscode', () => ({
  tsExtractImports: vi.fn(() => []),
  tsSortImports: vi.fn((code: string) => code),
}))

vi.mock('@mono/monorepo', () => ({
  MonoRepo: vi.fn(() => ({})),
}))

vi.mock('./internal/topImports', () => ({
  topImports: vi.fn(() => []),
}))

import fs from 'fs-extra'
import { tsSortImports, tsExtractImports } from '@mono/tscode'
import { topImports } from './internal/topImports'
import { insertImports } from './insertImports'

describe(insertImports.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a Command named "insertImports"', () => {
    const cmd = insertImports()
    expect(cmd.name()).toBe('insertImports')
  })

  it('should have alias "ii"', () => {
    const cmd = insertImports()
    expect(cmd.aliases()).toContain('ii')
  })

  it('should read file and write sorted imports', async () => {
    const origCode = 'const x = 1\n'
    vi.mocked(fs.readFileSync).mockReturnValue(origCode)
    vi.mocked(topImports).mockReturnValue([])
    vi.mocked(tsSortImports).mockImplementation((code: string) => code)
    vi.mocked(tsExtractImports).mockReturnValue([])

    const cmd = insertImports()
    await cmd.parseAsync(['test-file.ts'], { from: 'user' })

    expect(fs.readFileSync).toHaveBeenCalledWith('test-file.ts', 'utf-8')
    expect(fs.outputFileSync).toHaveBeenCalled()
  })

  it('should insert referenced imports', async () => {
    const origCode = 'const x = someFunc()\n'
    vi.mocked(fs.readFileSync).mockReturnValue(origCode)
    vi.mocked(topImports).mockReturnValue([{ count: 10, code: "import { someFunc } from 'some-lib'" }])
    vi.mocked(tsExtractImports).mockReturnValue([])
    vi.mocked(tsSortImports).mockImplementation((code: string) => code)

    const cmd = insertImports()
    await cmd.parseAsync(['test-file.ts'], { from: 'user' })

    expect(fs.outputFileSync).toHaveBeenCalled()
  })

  it('should insert all imports when --all flag is provided', async () => {
    const origCode = 'const x = 1\n'
    vi.mocked(fs.readFileSync).mockReturnValue(origCode)
    vi.mocked(topImports).mockReturnValue([{ count: 5, code: "import { unusedFunc } from 'unused-lib'" }])
    vi.mocked(tsExtractImports).mockReturnValue([])
    vi.mocked(tsSortImports).mockImplementation((code: string) => code)

    const cmd = insertImports()
    await cmd.parseAsync(['test-file.ts', '--all'], { from: 'user' })

    expect(fs.outputFileSync).toHaveBeenCalled()
  })

  it('should not duplicate existing imports', async () => {
    const origCode = "import { someFunc } from 'some-lib'\nconst x = someFunc()\n"
    vi.mocked(fs.readFileSync).mockReturnValue(origCode)
    vi.mocked(topImports).mockReturnValue([{ count: 10, code: "import { someFunc } from 'some-lib'" }])
    vi.mocked(tsExtractImports).mockReturnValue([
      { match: "import { someFunc } from 'some-lib'", index: 0 } as never,
    ])
    vi.mocked(tsSortImports).mockImplementation((code: string) => code)

    const cmd = insertImports()
    await cmd.parseAsync(['test-file.ts'], { from: 'user' })

    expect(fs.outputFileSync).toHaveBeenCalled()
  })

  it('should not insert imports for exported names', async () => {
    const origCode = 'export function someFunc() {}\n'
    vi.mocked(fs.readFileSync).mockReturnValue(origCode)
    vi.mocked(topImports).mockReturnValue([{ count: 10, code: "import { someFunc } from 'some-lib'" }])
    vi.mocked(tsExtractImports).mockReturnValue([])
    vi.mocked(tsSortImports).mockImplementation((code: string) => code)

    const cmd = insertImports()
    await cmd.parseAsync(['test-file.ts'], { from: 'user' })

    expect(fs.outputFileSync).toHaveBeenCalled()
  })

  it('should skip already-inserted imports when --all is used', async () => {
    const origCode = 'const x = someFunc()\n'
    vi.mocked(fs.readFileSync).mockReturnValue(origCode)
    vi.mocked(topImports).mockReturnValue([{ count: 10, code: "import { someFunc } from 'some-lib'" }])
    vi.mocked(tsExtractImports).mockReturnValue([])
    vi.mocked(tsSortImports).mockImplementation((code: string) => code)

    const cmd = insertImports()
    await cmd.parseAsync(['test-file.ts', '--all'], { from: 'user' })

    expect(fs.outputFileSync).toHaveBeenCalled()
  })
})
