import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { getAllImports } from './getAllImports'
import { MonoRepo } from '../MonoRepo'

describe(getAllImports.name, () => {
  it('should return empty array when no workspaces', () => {
    const repo = { workspaces: [] } as unknown as MonoRepo
    expect(getAllImports(repo)).toEqual([])
  })

  it('should return empty array when no source files', () => {
    const repo = {
      workspaces: [{ tsFiles: [] }],
    } as unknown as MonoRepo
    expect(getAllImports(repo)).toEqual([])
  })

  it('should skip non-source files', () => {
    const repo = {
      workspaces: [
        {
          tsFiles: [{ isSourceFile: false, tsCode: { imports: [{ module: { from: 'a' } }] } }],
        },
      ],
    } as unknown as MonoRepo
    expect(getAllImports(repo)).toEqual([])
  })

  it('should return all imports from source files across workspaces', () => {
    const imp1 = { module: { from: 'lodash' } }
    const imp2 = { module: { from: 'vitest' } }
    const imp3 = { module: { from: 'upath' } }
    const repo = {
      workspaces: [
        {
          tsFiles: [
            { isSourceFile: true, tsCode: { imports: [imp1, imp2] } },
            { isSourceFile: true, tsCode: { imports: [imp3] } },
            { isSourceFile: false, tsCode: { imports: [{ module: { from: 'skipped' } }] } },
          ],
        },
        {
          tsFiles: [],
        },
      ],
    } as unknown as MonoRepo
    const result = getAllImports(repo)
    expect(result).toEqual([imp1, imp2, imp3])
  })

  it('should return empty array when source file has no imports', () => {
    const repo = {
      workspaces: [
        {
          tsFiles: [{ isSourceFile: true, tsCode: { imports: [] } }],
        },
      ],
    } as unknown as MonoRepo
    expect(getAllImports(repo)).toEqual([])
  })
})
