import { describe, it, expect, vi } from 'vitest'
import upath from 'upath'
import { cwd } from './cwd'

describe(cwd.name, () => {
  it('should join paths starting from process.cwd()', () => {
    const mockCwd = '/mocked/current/directory'
    const paths = ['folder', 'file.txt']
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    const joinSafeSpy = vi.spyOn(upath, 'joinSafe')
    const result = cwd(...paths)
    expect(joinSafeSpy).toHaveBeenCalledWith(mockCwd, ...paths)
    expect(result).toBe(upath.joinSafe(mockCwd, ...paths))
    vi.restoreAllMocks()
  })

  it('should handle no additional paths', () => {
    const mockCwd = '/mocked/current/directory'
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    const result = cwd()
    expect(result).toBe(mockCwd)
    vi.restoreAllMocks()
  })

  it('should handle a single path', () => {
    const mockCwd = '/mocked/current/directory'
    const singlePath = 'folder'
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    const result = cwd(singlePath)
    expect(result).toBe(upath.joinSafe(mockCwd, singlePath))
    vi.restoreAllMocks()
  })

  it('should handle multiple paths', () => {
    const mockCwd = '/mocked/current/directory'
    const paths = ['folder1', 'folder2', 'file.txt']
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    const result = cwd(...paths)
    expect(result).toBe(upath.joinSafe(mockCwd, ...paths))
    vi.restoreAllMocks()
  })
})
