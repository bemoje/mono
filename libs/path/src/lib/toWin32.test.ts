import { describe, it, expect } from 'vitest'
import { toWin32 } from './toWin32'

describe(toWin32.name, () => {
  it('replaces forward slashes with backslashes', () => {
    expect(toWin32('path/to/file')).toBe('path\\to\\file')
  })

  it('returns the same string if no forward slashes are present', () => {
    expect(toWin32('path\\to\\file')).toBe('path\\to\\file')
  })

  it('handles an empty string', () => {
    expect(toWin32('')).toBe('')
  })

  it('handles strings with only forward slashes', () => {
    expect(toWin32('////')).toBe('\\\\\\\\')
  })

  it('handles mixed forward and backslashes', () => {
    expect(toWin32('path/to\\file')).toBe('path\\to\\file')
  })
})
