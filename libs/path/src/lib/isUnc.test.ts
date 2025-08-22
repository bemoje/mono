import { describe, it, expect } from 'vitest'
import { isUnc } from './isUnc'

describe(isUnc.name, function () {
  it('should return true for UNC paths', function () {
    expect(isUnc('\\/foo/bar')).toBe(true)
    expect(isUnc('\\\\foo/bar')).toBe(true)
    expect(isUnc('\\\\foo\\admin$')).toBe(true)
    expect(isUnc('\\\\foo\\admin$\\system32')).toBe(true)
    expect(isUnc('\\\\foo\\temp')).toBe(true)
    expect(isUnc('\\\\/foo/bar')).toBe(true)
    expect(isUnc('\\\\\\/foo/bar')).toBe(true)
  })

  it('should return false for non-UNC paths', function () {
    expect(isUnc('/foo/bar')).toBe(false)
    expect(isUnc('/')).toBe(false)
    expect(isUnc('/foo')).toBe(false)
    expect(isUnc('/foo/')).toBe(false)
    expect(isUnc('c:')).toBe(false)
    expect(isUnc('c:.')).toBe(false)
    expect(isUnc('c:./')).toBe(false)
    expect(isUnc('c:./file')).toBe(false)
    expect(isUnc('c:/')).toBe(false)
    expect(isUnc('c:/file')).toBe(false)
  })

  it('should return true if the filepath is a UNC path', () => {
    expect(isUnc('//server/share/dir/file.txt')).toBe(true)
  })

  it('should return false if the filepath is not a UNC path', () => {
    expect(isUnc('')).toBe(false)
    expect(isUnc('/')).toBe(false)
    expect(isUnc('/dir/file.txt')).toBe(false)
    expect(isUnc('C:/')).toBe(false)
    expect(isUnc('C:/dir/file.txt')).toBe(false)
    expect(isUnc('file.txt')).toBe(false)
    expect(isUnc('dir/file.txt')).toBe(false)
  })
})
