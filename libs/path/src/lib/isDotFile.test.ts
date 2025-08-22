import { describe, it, expect } from 'vitest'
import { isDotFile } from './isDotFile'

describe(isDotFile.name, () => {
  it('should work for dot-files.', () => {
    expect(isDotFile('.git')).toBe(true)
    expect(isDotFile('.travis.yml')).toBe(true)
    expect(isDotFile('.editorconfig')).toBe(true)
    expect(isDotFile('/.git')).toBe(true)
    expect(isDotFile('a/b.c.d/e.js/.git')).toBe(true)
    expect(isDotFile('a/.b/c/.gitignore')).toBe(true)
    expect(isDotFile('a/.gitignore')).toBe(true)
    expect(isDotFile('a/b/c/d/.gitignore')).toBe(true)
  })

  it('should work for non dot-files.', () => {
    expect(isDotFile('a/b/c/d/e.js')).toBe(false)
    expect(isDotFile('a/b.js')).toBe(false)
    expect(isDotFile('a/.git/c/a.js')).toBe(false)
    expect(isDotFile('.github/contributor.md')).toBe(false)
    expect(isDotFile('.git/foo')).toBe(false)
  })
})
