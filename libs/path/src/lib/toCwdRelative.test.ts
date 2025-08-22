import { describe, it, expect, vi } from 'vitest'
import upath from 'upath'
import { toCwdRelative } from './toCwdRelative'

describe(toCwdRelative.name, () => {
  it('examples', () => {
    expect(() => {
      // Mock process.cwd() for consistent testing
      const mockCwd = '/home/user/project'
      vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)

      const result = toCwdRelative('/home/user/project/src/file.ts')
      // Should return relative path from cwd to the file
      expect(result).toBe('src/file.ts')

      vi.restoreAllMocks()
    }).not.toThrow()
  })

  it('should return relative path from process.cwd() to given path', () => {
    const mockCwd = '/home/user/project'
    const targetPath = '/home/user/project/src/components/Button.tsx'

    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    vi.spyOn(upath, 'relative').mockReturnValue('src/components/Button.tsx')

    const result = toCwdRelative(targetPath)

    expect(upath.relative).toHaveBeenCalledWith(mockCwd, targetPath)
    expect(result).toBe('src/components/Button.tsx')

    vi.restoreAllMocks()
  })

  it('should handle paths outside the current directory', () => {
    const mockCwd = '/home/user/project'
    const targetPath = '/home/user/other-project/file.ts'

    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    vi.spyOn(upath, 'relative').mockReturnValue('../other-project/file.ts')

    const result = toCwdRelative(targetPath)

    expect(result).toBe('../other-project/file.ts')

    vi.restoreAllMocks()
  })

  it('should handle same directory paths', () => {
    const mockCwd = '/home/user/project'
    const targetPath = '/home/user/project'

    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    vi.spyOn(upath, 'relative').mockReturnValue('')

    const result = toCwdRelative(targetPath)

    expect(result).toBe('')

    vi.restoreAllMocks()
  })
})
