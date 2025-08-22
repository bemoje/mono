import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { isLinux } from './isLinux'

// Mock process
const mockProcess = {
  platform: 'linux',
}

vi.stubGlobal('process', mockProcess)

describe(isLinux.name, () => {
  it('examples', () => {
    expect(() => {
      mockProcess.platform = 'linux'
      const result = isLinux()

      assert.strictEqual(result, true, 'Linux detection')
    }).not.toThrow()
  })

  it('should return true when platform is linux', () => {
    mockProcess.platform = 'linux'

    const result = isLinux()

    expect(result).toBe(true)
  })

  it('should return false when platform is win32', () => {
    mockProcess.platform = 'win32'

    const result = isLinux()

    expect(result).toBe(false)
  })

  it('should return false when platform is darwin', () => {
    mockProcess.platform = 'darwin'

    const result = isLinux()

    expect(result).toBe(false)
  })

  it('should return false when platform is unknown', () => {
    mockProcess.platform = 'unknown'

    const result = isLinux()

    expect(result).toBe(false)
  })
})
