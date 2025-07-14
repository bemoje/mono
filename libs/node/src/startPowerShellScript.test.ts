import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { startPowerShellScript } from './startPowerShellScript'

const startPowerShellScriptEmitter = startPowerShellScript.emitterSync

const { mockExec, mockExecAsync } = vi.hoisted(() => {
  return {
    mockExec: vi.fn(),
    mockExecAsync: vi.fn(),
  }
})

// Mock child_process and util
vi.mock('child_process', async () => {
  return {
    exec: mockExec,
  }
})

vi.mock('util', async () => {
  return {
    promisify: vi.fn(() => mockExecAsync),
  }
})

describe('startPowerShellScript', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe(startPowerShellScript.name, () => {
    it('examples', async () => {
      expect(() => {
        // Mock successful execution
        mockExecAsync.mockResolvedValue({ stdout: 'success output', stderr: '' })

        // Basic script execution
        const result = startPowerShellScript('test-script.ps1')
        assert(result instanceof Promise, 'should return promise')

        // Script with arguments
        const resultWithArgs = startPowerShellScript('script.ps1', 'arg1', 'arg2')
        assert(resultWithArgs instanceof Promise, 'should handle arguments')
      }).not.toThrow()
    })

    it('should execute PowerShell script and return stdout/stderr', async () => {
      const mockStdout = 'Script executed successfully'
      const mockStderr = ''

      mockExecAsync.mockResolvedValue({ stdout: mockStdout, stderr: mockStderr })

      const result = await startPowerShellScript('test-script.ps1')

      expect(result).toEqual({
        stdout: mockStdout,
        stderr: mockStderr,
      })

      expect(mockExecAsync).toHaveBeenCalledWith('test-script.ps1', { shell: 'powershell.exe' })
    })

    it('should handle script with arguments', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

      await startPowerShellScript('script.ps1', 'arg1', 'arg2', 'arg3')

      expect(mockExecAsync).toHaveBeenCalledWith('script.ps1 arg1 arg2 arg3', { shell: 'powershell.exe' })
    })

    it('should handle arguments with spaces by quoting them', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

      await startPowerShellScript('script.ps1', 'arg with spaces', 'normal-arg')

      expect(mockExecAsync).toHaveBeenCalledWith('script.ps1 "arg with spaces" normal-arg', {
        shell: 'powershell.exe',
      })
    })

    it('should handle arguments with quotes by using single quotes', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

      await startPowerShellScript('script.ps1', 'arg with "quotes"', 'normal-arg')

      expect(mockExecAsync).toHaveBeenCalledWith('script.ps1 \'arg with "quotes"\' normal-arg', {
        shell: 'powershell.exe',
      })
    })

    it('should handle file paths with spaces', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

      await startPowerShellScript('path with spaces/script.ps1')

      expect(mockExecAsync).toHaveBeenCalledWith('"path with spaces/script.ps1"', { shell: 'powershell.exe' })
    })

    it('should reject when exec returns an error', async () => {
      const mockError = new Error('PowerShell execution failed')

      mockExecAsync.mockRejectedValue(mockError)

      await expect(startPowerShellScript('failing-script.ps1')).rejects.toThrow('PowerShell execution failed')
    })

    it('should return stderr content when script writes to stderr', async () => {
      const mockStdout = 'Normal output'
      const mockStderr = 'Warning: Something happened'

      mockExecAsync.mockResolvedValue({ stdout: mockStdout, stderr: mockStderr })

      const result = await startPowerShellScript('script-with-warnings.ps1')

      expect(result).toEqual({
        stdout: mockStdout,
        stderr: mockStderr,
      })
    })
  })

  describe(startPowerShellScriptEmitter.name, () => {
    it('examples', () => {
      expect(() => {
        const mockChild = {
          stdout: { on: vi.fn() },
          stderr: { on: vi.fn() },
          on: vi.fn(),
        }

        mockExec.mockReturnValue(mockChild as any)

        // Basic script execution
        const child = startPowerShellScriptEmitter('test-script.ps1')
        assert(typeof child === 'object' && child !== null, 'should return child process')

        // Script with arguments
        const childWithArgs = startPowerShellScriptEmitter('script.ps1', 'arg1', 'arg2')
        assert(typeof childWithArgs === 'object' && childWithArgs !== null, 'should handle arguments')
      }).not.toThrow()
    })

    it('should return child process for streaming output', () => {
      const mockChild = {
        stdout: { on: vi.fn() },
        stderr: { on: vi.fn() },
        on: vi.fn(),
      }

      mockExec.mockReturnValue(mockChild as any)

      const result = startPowerShellScriptEmitter('stream-script.ps1')

      expect(result).toBe(mockChild)
      expect(mockExec).toHaveBeenCalledWith('stream-script.ps1', { shell: 'powershell.exe' })
    })

    it('should handle script with arguments for streaming', () => {
      const mockChild = {
        stdout: { on: vi.fn() },
        stderr: { on: vi.fn() },
        on: vi.fn(),
      }

      mockExec.mockReturnValue(mockChild as any)

      const result = startPowerShellScriptEmitter('script.ps1', 'stream-arg1', 'stream-arg2')

      expect(result).toBe(mockChild)
      expect(mockExec).toHaveBeenCalledWith('script.ps1 stream-arg1 stream-arg2', { shell: 'powershell.exe' })
    })

    it('should handle arguments with special characters for streaming', () => {
      const mockChild = {
        stdout: { on: vi.fn() },
        stderr: { on: vi.fn() },
        on: vi.fn(),
      }

      mockExec.mockReturnValue(mockChild as any)

      startPowerShellScriptEmitter('script.ps1', 'arg with spaces', 'arg"with"quotes')

      expect(mockExec).toHaveBeenCalledWith('script.ps1 "arg with spaces" \'arg"with"quotes\'', {
        shell: 'powershell.exe',
      })
    })
  })

  describe('command generation', () => {
    it('should handle empty arguments array', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

      await startPowerShellScript('script.ps1')

      expect(mockExecAsync).toHaveBeenCalledWith('script.ps1', { shell: 'powershell.exe' })
    })

    it('should handle mixed argument types', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

      await startPowerShellScript('script.ps1', 'simple', 'arg with spaces', 'arg"with"quotes', 'another-simple')

      expect(mockExecAsync).toHaveBeenCalledWith(
        'script.ps1 simple "arg with spaces" \'arg"with"quotes\' another-simple',
        { shell: 'powershell.exe' },
      )
    })

    describe('command generation', () => {
      it('should handle empty arguments array', async () => {
        mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

        await startPowerShellScript('script.ps1')

        expect(mockExecAsync).toHaveBeenCalledWith('script.ps1', { shell: 'powershell.exe' })
      })

      it('should handle scripts in quoted directories', async () => {
        mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

        await startPowerShellScript('C:\\Program Files\\Scripts\\my script.ps1')

        expect(mockExecAsync).toHaveBeenCalledWith('"C:\\Program Files\\Scripts\\my script.ps1"', {
          shell: 'powershell.exe',
        })
      })

      it('should handle arguments that already contain both single and double quotes', async () => {
        mockExecAsync.mockResolvedValue({ stdout: 'output', stderr: '' })

        // This is an edge case - if an argument contains both single and double quotes,
        // the current implementation will use single quotes (which might escape the doubles)
        await startPowerShellScript('script.ps1', `arg with 'single' and "double" quotes`)

        expect(mockExecAsync).toHaveBeenCalledWith(`script.ps1 'arg with 'single' and "double" quotes'`, {
          shell: 'powershell.exe',
        })
      })
    })

    describe('error handling', () => {
      it('should handle exec throwing synchronously', async () => {
        mockExecAsync.mockRejectedValue(new Error('Exec failed synchronously'))

        await expect(startPowerShellScript('failing-script.ps1')).rejects.toThrow()
      })

      it('should handle promisify rejecting', async () => {
        mockExecAsync.mockRejectedValue(new Error('Execution error'))

        await expect(startPowerShellScript('error-script.ps1')).rejects.toThrow('Execution error')
      })
    })
  })
})
