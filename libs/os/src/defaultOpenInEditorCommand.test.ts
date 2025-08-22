import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'

// Mock dependencies first
vi.mock('./isOSX', () => ({
  isOSX: vi.fn(),
}))
vi.mock('./isVsCodeInstalled', () => ({
  isVsCodeInstalled: vi.fn(),
}))
vi.mock('./isWindows', () => ({
  isWindows: vi.fn(),
}))

describe('defaultOpenInEditorCommand', () => {
  let mockIsOSX: any
  let mockIsVsCodeInstalled: any
  let mockIsWindows: any
  let defaultOpenInEditorCommand: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Get fresh mocks
    const { isOSX } = await import('./isOSX')
    const { isVsCodeInstalled } = await import('./isVsCodeInstalled')
    const { isWindows } = await import('./isWindows')

    mockIsOSX = vi.mocked(isOSX)
    mockIsVsCodeInstalled = vi.mocked(isVsCodeInstalled)
    mockIsWindows = vi.mocked(isWindows)

    // Import fresh module
    const module = await import('./defaultOpenInEditorCommand')
    defaultOpenInEditorCommand = module.defaultOpenInEditorCommand
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('examples', () => {
    expect(() => {
      mockIsVsCodeInstalled.mockReturnValue(true)
      const command = defaultOpenInEditorCommand()

      assert.strictEqual(command, 'code -w', 'VSCode command')
    }).not.toThrow()
  })

  it('should return VSCode command when VSCode is installed', () => {
    mockIsVsCodeInstalled.mockReturnValue(true)

    const result = defaultOpenInEditorCommand()

    expect(result).toBe('code -w')
    expect(mockIsVsCodeInstalled).toHaveBeenCalledOnce()
  })

  it('should return notepad command on Windows when VSCode is not installed', () => {
    mockIsVsCodeInstalled.mockReturnValue(false)
    mockIsWindows.mockReturnValue(true)

    const result = defaultOpenInEditorCommand()

    expect(result).toBe('notepad')
    expect(mockIsVsCodeInstalled).toHaveBeenCalledOnce()
    expect(mockIsWindows).toHaveBeenCalledOnce()
  })

  it('should return vi command on OSX when VSCode is not installed', () => {
    mockIsVsCodeInstalled.mockReturnValue(false)
    mockIsWindows.mockReturnValue(false)
    mockIsOSX.mockReturnValue(true)

    const result = defaultOpenInEditorCommand()

    expect(result).toBe('open vi')
    expect(mockIsVsCodeInstalled).toHaveBeenCalledOnce()
    expect(mockIsWindows).toHaveBeenCalledOnce()
    expect(mockIsOSX).toHaveBeenCalledOnce()
  })

  it('should return xdg-open command on Linux when VSCode is not installed', () => {
    mockIsVsCodeInstalled.mockReturnValue(false)
    mockIsWindows.mockReturnValue(false)
    mockIsOSX.mockReturnValue(false)

    const result = defaultOpenInEditorCommand()

    expect(result).toBe('xdg-open')
    expect(mockIsVsCodeInstalled).toHaveBeenCalledOnce()
    expect(mockIsWindows).toHaveBeenCalledOnce()
    expect(mockIsOSX).toHaveBeenCalledOnce()
  })

  it('should cache the command result', () => {
    mockIsVsCodeInstalled.mockReturnValue(true)

    const result1 = defaultOpenInEditorCommand()
    const result2 = defaultOpenInEditorCommand()

    expect(result1).toBe('code -w')
    expect(result2).toBe('code -w')
    expect(mockIsVsCodeInstalled).toHaveBeenCalledOnce()
  })
})
