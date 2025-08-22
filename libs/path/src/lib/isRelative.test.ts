import { describe, it, expect, vi } from 'vitest'
import path from 'path'
import { isRelative } from './isRelative'

describe(isRelative.name, () => {
  it('should return true for relative paths', () => {
    vi.spyOn(path, 'isAbsolute').mockReturnValueOnce(false)
    const result = isRelative('./relative/path')
    expect(result).toBe(true)
  })

  it('should return false for absolute paths', () => {
    vi.spyOn(path, 'isAbsolute').mockReturnValueOnce(true)
    const result = isRelative('/absolute/path')
    expect(result).toBe(false)
  })

  it('should handle empty string as relative path', () => {
    vi.spyOn(path, 'isAbsolute').mockReturnValueOnce(false)
    const result = isRelative('')
    expect(result).toBe(true)
  })
})
