import { describe, expect, it } from 'vitest'
import { getTempFilepath } from './getTempFilepath'

describe(getTempFilepath.name, () => {
  it('should return a temp filepath with default subpath', () => {
    const result = getTempFilepath('file.txt')
    expect(result).toContain('tmp')
    expect(result).toContain('file.txt')
  })

  it('should return a temp filepath with custom subpath', () => {
    const result = getTempFilepath('file.txt', 'custom')
    expect(result).toContain('custom')
    expect(result).toContain('file.txt')
  })
})
