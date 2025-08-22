import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'

// Mock process globally for each test
const mockProcess = {
  platform: 'win32',
  env: {},
}

describe('isWindows', () => {
  let isWindows: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Set up fresh process mock
    vi.stubGlobal('process', { ...mockProcess })

    // Import fresh module to reset cached value
    const module = await import('./isWindows')
    isWindows = module.isWindows
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('examples', () => {
    expect(() => {
      const globalProcess = globalThis.process as any
      globalProcess.platform = 'win32'
      globalProcess.env = {}
      const result = isWindows()

      assert.strictEqual(result, true, 'Windows detection')
    }).not.toThrow()
  })

  it('should return true when platform is win32', () => {
    const globalProcess = globalThis.process as any
    globalProcess.platform = 'win32'
    globalProcess.env = {}

    const result = isWindows()

    expect(result).toBe(true)
  })

  it('should return true when OSTYPE is msys', () => {
    const globalProcess = globalThis.process as any
    globalProcess.platform = 'linux'
    globalProcess.env = { OSTYPE: 'msys' }

    const result = isWindows()

    expect(result).toBe(true)
  })

  it('should return true when OSTYPE is cygwin', () => {
    const globalProcess = globalThis.process as any
    globalProcess.platform = 'linux'
    globalProcess.env = { OSTYPE: 'cygwin' }

    const result = isWindows()

    expect(result).toBe(true)
  })

  it('should return false when platform is darwin', () => {
    const globalProcess = globalThis.process as any
    globalProcess.platform = 'darwin'
    globalProcess.env = {}

    const result = isWindows()

    expect(result).toBe(false)
  })

  it('should return false when platform is linux', () => {
    const globalProcess = globalThis.process as any
    globalProcess.platform = 'linux'
    globalProcess.env = {}

    const result = isWindows()

    expect(result).toBe(false)
  })

  it('should return false when OSTYPE is different', () => {
    const globalProcess = globalThis.process as any
    globalProcess.platform = 'linux'
    globalProcess.env = { OSTYPE: 'bash' }

    const result = isWindows()

    expect(result).toBe(false)
  })

  it('should cache the result', () => {
    const globalProcess = globalThis.process as any
    globalProcess.platform = 'win32'
    globalProcess.env = {}

    const result1 = isWindows()
    globalProcess.platform = 'linux' // Change platform after first call
    const result2 = isWindows()

    expect(result1).toBe(true)
    expect(result2).toBe(true) // Should return cached value
  })
})
