import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@mono/monorepo', () => ({
  getAllImports: vi.fn(),
}))

vi.mock('upath', () => ({
  default: {
    parse: vi.fn((p: string) => {
      const name =
        p
          .split('/')
          .pop()
          ?.replace(/\.\w+$/, '') ?? ''
      return { name }
    }),
  },
}))

import * as _monorepo from '@mono/monorepo'
import { topImports } from './topImports'

describe(topImports.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return sorted array of top imports', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: true },
        split: () => ["import { a } from 'lib-a'", "import { a } from 'lib-a'"],
      },
      {
        path: '/repo/libs/test/src/other.ts',
        module: { isDependency: true },
        split: () => ["import { b } from 'lib-b'"],
      },
    ] as never)

    const result = topImports({} as never, 10)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('count')
    expect(result[0]).toHaveProperty('code')
  })

  it('should exclude index files', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/index.ts',
        module: { isDependency: true },
        split: () => ["import { a } from 'lib-a'"],
      },
    ] as never)

    const result = topImports({} as never, 10)
    expect(result).toHaveLength(0)
  })

  it('should exclude non-dependency imports', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: false },
        split: () => ["import { a } from './local'"],
      },
    ] as never)

    const result = topImports({} as never, 10)
    expect(result).toHaveLength(0)
  })

  it('should normalize import type to import', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: true },
        split: () => ["import type { MyType } from 'lib-a'"],
      },
    ] as never)

    const result = topImports({} as never, 10)
    expect(result.length).toBe(1)
    expect(result[0].code).toBe("import { MyType } from 'lib-a'")
  })

  it('should normalize namespace imports', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: true },
        split: () => ["import * as ns from 'lib-a'"],
      },
    ] as never)

    const result = topImports({} as never, 10)
    expect(result.length).toBe(1)
    expect(result[0].code).toBe("import ns from 'lib-a'")
  })

  it('should respect the n limit', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: true },
        split: () => ["import { a } from 'lib-a'", "import { b } from 'lib-b'", "import { c } from 'lib-c'"],
      },
    ] as never)

    const result = topImports({} as never, 2)
    expect(result.length).toBeLessThanOrEqual(2)
  })

  it('should apply custom normalize function', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: true },
        split: () => ["import { a } from 'lib-a'"],
      },
    ] as never)

    const result = topImports({} as never, 10, (line) => line.toUpperCase())
    expect(result.length).toBe(1)
    expect(result[0].code).toBe("IMPORT { A } FROM 'LIB-A'")
  })

  it('should filter out falsy values after normalize', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: true },
        split: () => ["import { a } from 'lib-a'"],
      },
    ] as never)

    const result = topImports({} as never, 10, () => '')
    expect(result).toHaveLength(0)
  })

  it('should sort by count descending', () => {
    vi.mocked(_monorepo.getAllImports).mockReturnValue([
      {
        path: '/repo/libs/test/src/helper.ts',
        module: { isDependency: true },
        split: () => ["import { a } from 'lib-a'", "import { a } from 'lib-a'", "import { b } from 'lib-b'"],
      },
    ] as never)

    const result = topImports({} as never, 10)
    expect(result[0].count).toBeGreaterThanOrEqual(result[result.length - 1].count)
  })
})
