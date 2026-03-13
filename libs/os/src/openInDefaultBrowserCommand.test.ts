import assert from 'assert'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

// Mock dependencies
vi.mock('./getOS', () => {
  return { getOS: vi.fn() }
})
vi.mock('./getDefaultBrowserWindows', () => {
  return { getDefaultBrowserWindows: vi.fn() }
})

describe('openInDefaultBrowserCommand', () => {
  let mockGetOS: any
  let mockGetDefaultBrowserWindows: any
  let openInDefaultBrowserCommand: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Get fresh mocks
    const { getOS } = await import('./getOS')
    const { getDefaultBrowserWindows } = await import('./getDefaultBrowserWindows')

    mockGetOS = vi.mocked(getOS)
    mockGetDefaultBrowserWindows = vi.mocked(getDefaultBrowserWindows)

    // Import fresh module
    const module = await import('./openInDefaultBrowserCommand')
    openInDefaultBrowserCommand = module.openInDefaultBrowserCommand
  })

  it('examples', () => {
    expect(() => {
      mockGetOS.mockReturnValue('windows')
      mockGetDefaultBrowserWindows.mockReturnValue({ run: 'start chrome' })

      const result = openInDefaultBrowserCommand('https://example.com')

      assert.strictEqual(result, 'start chrome "https://example.com"', 'windows command with URL')
    }).not.toThrow()
  })

  it('should return Windows browser command with URL', () => {
    mockGetOS.mockReturnValue('windows')
    mockGetDefaultBrowserWindows.mockReturnValue({ run: 'start chrome' })

    const result = openInDefaultBrowserCommand('https://example.com')

    expect(result).toBe('start chrome "https://example.com"')
    expect(mockGetDefaultBrowserWindows).toHaveBeenCalledOnce()
  })

  it('should return Windows browser command without URL', () => {
    mockGetOS.mockReturnValue('windows')
    mockGetDefaultBrowserWindows.mockReturnValue({ run: 'start chrome' })

    const result = openInDefaultBrowserCommand()

    expect(result).toBe('start chrome')
    expect(mockGetDefaultBrowserWindows).toHaveBeenCalledOnce()
  })

  it('should return OSX command with URL', () => {
    mockGetOS.mockReturnValue('osx')

    const result = openInDefaultBrowserCommand('https://example.com')

    expect(result).toBe('open safari "https://example.com"')
    expect(mockGetDefaultBrowserWindows).not.toHaveBeenCalled()
  })

  it('should return OSX command without URL', () => {
    mockGetOS.mockReturnValue('osx')

    const result = openInDefaultBrowserCommand()

    expect(result).toBe('open safari')
    expect(mockGetDefaultBrowserWindows).not.toHaveBeenCalled()
  })

  it('should return Linux command with URL', () => {
    mockGetOS.mockReturnValue('linux')

    const result = openInDefaultBrowserCommand('https://example.com')

    expect(result).toBe('xdg-open "https://example.com"')
    expect(mockGetDefaultBrowserWindows).not.toHaveBeenCalled()
  })

  it('should return Linux command without URL', () => {
    mockGetOS.mockReturnValue('linux')

    const result = openInDefaultBrowserCommand()

    expect(result).toBe('xdg-open')
    expect(mockGetDefaultBrowserWindows).not.toHaveBeenCalled()
  })

  it('should throw error for unknown OS', () => {
    mockGetOS.mockReturnValue('unknown')

    expect(() => {
      return openInDefaultBrowserCommand()
    }).toThrow('Unknown OS: unknown')
    expect(mockGetDefaultBrowserWindows).not.toHaveBeenCalled()
  })
})
