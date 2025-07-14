import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'

// Mock dependencies
vi.mock('child_process', () => ({
  exec: vi.fn(),
}))
vi.mock('./getOS', () => ({
  getOS: vi.fn(),
}))

describe('isLinuxProgramInstalled', () => {
  let mockExec: any
  let mockGetOS: any
  let isLinuxProgramInstalled: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Get fresh mocks
    const { exec } = await import('child_process')
    const { getOS } = await import('./getOS')

    mockExec = vi.mocked(exec)
    mockGetOS = vi.mocked(getOS)

    // Import fresh module
    const module = await import('./isLinuxProgramInstalled')
    isLinuxProgramInstalled = module.isLinuxProgramInstalled
  })

  it('examples', () => {
    expect(async () => {
      mockGetOS.mockReturnValue('linux')
      mockExec.mockImplementation((command: any, callback: any) => {
        callback(null, 'stdout', 'stderr')
        return {} as any
      })

      const result = await isLinuxProgramInstalled('git')

      assert.strictEqual(result, true, 'program installed')
    }).not.toThrow()
  })

  it('should return true when program is found on Linux', async () => {
    mockGetOS.mockReturnValue('linux')
    mockExec.mockImplementation((command: any, callback: any) => {
      callback(null, '/usr/bin/git', '')
      return {} as any
    })

    const result = await isLinuxProgramInstalled('git')

    expect(result).toBe(true)
    expect(mockExec).toHaveBeenCalledWith('which git', expect.any(Function))
  })

  it('should return false when program is not found on Linux', async () => {
    mockGetOS.mockReturnValue('linux')
    mockExec.mockImplementation((command: any, callback: any) => {
      callback(new Error('Command not found'), '', 'git: command not found')
      return {} as any
    })

    const result = await isLinuxProgramInstalled('nonexistent')

    expect(result).toBe(false)
    expect(mockExec).toHaveBeenCalledWith('which nonexistent', expect.any(Function))
  })

  it('should return false when OS is not Linux', async () => {
    mockGetOS.mockReturnValue('windows')

    const result = await isLinuxProgramInstalled('git')

    expect(result).toBe(false)
    expect(mockExec).not.toHaveBeenCalled()
  })

  it('should return false when OS is OSX', async () => {
    mockGetOS.mockReturnValue('osx')

    const result = await isLinuxProgramInstalled('git')

    expect(result).toBe(false)
    expect(mockExec).not.toHaveBeenCalled()
  })

  it('should return false when OS is unknown', async () => {
    mockGetOS.mockReturnValue('unknown')

    const result = await isLinuxProgramInstalled('git')

    expect(result).toBe(false)
    expect(mockExec).not.toHaveBeenCalled()
  })
})
