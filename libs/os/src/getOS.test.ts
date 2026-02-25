import assert from 'node:assert'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { getOS } from './getOS'
import { isLinux } from './isLinux'
import { isOSX } from './isOSX'
import { isWindows } from './isWindows'
import { it } from 'vitest'
import { vi } from 'vitest'

// Mock dependencies
vi.mock('./isLinux', () => {
  return {
    isLinux: vi.fn(),
  }
})
vi.mock('./isOSX', () => {
  return {
    isOSX: vi.fn(),
  }
})
vi.mock('./isWindows', () => {
  return {
    isWindows: vi.fn(),
  }
})

const mockIsLinux = vi.mocked(isLinux)
const mockIsOSX = vi.mocked(isOSX)
const mockIsWindows = vi.mocked(isWindows)

describe(getOS.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      mockIsLinux.mockReturnValue(true)
      mockIsOSX.mockReturnValue(false)
      mockIsWindows.mockReturnValue(false)
      const os = getOS()

      assert.strictEqual(os, 'linux', 'OS detection')
    }).not.toThrow()
  })

  it('should return linux when isLinux returns true', () => {
    mockIsLinux.mockReturnValue(true)
    mockIsOSX.mockReturnValue(false)
    mockIsWindows.mockReturnValue(false)

    const result = getOS()

    expect(result).toBe('linux')
    expect(mockIsLinux).toHaveBeenCalledOnce()
  })

  it('should return osx when isOSX returns true', () => {
    mockIsLinux.mockReturnValue(false)
    mockIsOSX.mockReturnValue(true)
    mockIsWindows.mockReturnValue(false)

    const result = getOS()

    expect(result).toBe('osx')
    expect(mockIsLinux).toHaveBeenCalledOnce()
    expect(mockIsOSX).toHaveBeenCalledOnce()
  })

  it('should return windows when isWindows returns true', () => {
    mockIsLinux.mockReturnValue(false)
    mockIsOSX.mockReturnValue(false)
    mockIsWindows.mockReturnValue(true)

    const result = getOS()

    expect(result).toBe('windows')
    expect(mockIsLinux).toHaveBeenCalledOnce()
    expect(mockIsOSX).toHaveBeenCalledOnce()
    expect(mockIsWindows).toHaveBeenCalledOnce()
  })

  it('should return unknown when no OS is detected', () => {
    mockIsLinux.mockReturnValue(false)
    mockIsOSX.mockReturnValue(false)
    mockIsWindows.mockReturnValue(false)

    const result = getOS()

    expect(result).toBe('unknown')
    expect(mockIsLinux).toHaveBeenCalledOnce()
    expect(mockIsOSX).toHaveBeenCalledOnce()
    expect(mockIsWindows).toHaveBeenCalledOnce()
  })

  it('should check OS functions in correct order', () => {
    mockIsLinux.mockReturnValue(false)
    mockIsOSX.mockReturnValue(false)
    mockIsWindows.mockReturnValue(false)

    getOS()

    expect(mockIsLinux).toHaveBeenCalledBefore(mockIsOSX as any)
    expect(mockIsOSX).toHaveBeenCalledBefore(mockIsWindows as any)
  })
})
