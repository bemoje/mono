import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { isOSX } from './isOSX'

// Mock process
const mockProcess = {
  platform: 'darwin',
}

vi.stubGlobal('process', mockProcess)

describe(isOSX.name, () => {
  it('examples', () => {
    expect(() => {
      mockProcess.platform = 'darwin'
      const result = isOSX()

      assert.strictEqual(result, true, 'OSX detection')
    }).not.toThrow()
  })

  it('should return true when platform is darwin', () => {
    mockProcess.platform = 'darwin'

    const result = isOSX()

    expect(result).toBe(true)
  })

  it('should return false when platform is win32', () => {
    mockProcess.platform = 'win32'

    const result = isOSX()

    expect(result).toBe(false)
  })

  it('should return false when platform is linux', () => {
    mockProcess.platform = 'linux'

    const result = isOSX()

    expect(result).toBe(false)
  })

  it('should return false when platform is unknown', () => {
    mockProcess.platform = 'unknown'

    const result = isOSX()

    expect(result).toBe(false)
  })
})
