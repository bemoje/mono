import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import { execSync } from 'child_process'
import colors from 'ansi-colors'
import path from 'upath'
import { execute } from './execute'

// Mock dependencies
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}))

vi.mock('upath', () => ({
  default: {
    relative: vi.fn(),
    basename: vi.fn(),
  },
}))

const mockExecSync = vi.mocked(execSync)
const mockPath = vi.mocked(path)

describe(execute.name, () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let originalCwd: string

  beforeEach(() => {
    vi.clearAllMocks()
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    originalCwd = process.cwd()

    // Setup default mocks
    mockPath.relative.mockReturnValue('relative/path')
    mockPath.basename.mockReturnValue('basename')
    mockExecSync.mockReturnValue(Buffer.from('command output'))
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    process.chdir(originalCwd)
  })

  it('examples', () => {
    expect(() => {
      // Basic command execution
      const result = execute('echo hello')
      assert(typeof result === 'string', 'should return string')

      // Multiple commands
      const multiResult = execute(['echo hello', 'echo world'])
      assert(typeof multiResult === 'string', 'should handle multiple commands')

      // Command with options
      const optionsResult = execute('ls', { cwd: '/tmp', silent: true })
      assert(typeof optionsResult === 'string', 'should handle options')

      // Command with all options
      const fullOptionsResult = execute('pwd', {
        cwd: '/custom',
        silent: false,
        fadedOutput: true,
        noEcho: false,
      })
      assert(typeof fullOptionsResult === 'string', 'should handle all options')
    }).not.toThrow()
  })

  describe('single command execution', () => {
    it('should execute command and return output', () => {
      const output = 'Hello World'
      mockExecSync.mockReturnValue(Buffer.from(output))

      const result = execute('echo "Hello World"')

      expect(result).toBe(output)
      expect(mockExecSync).toHaveBeenCalledWith('echo "Hello World"', {
        stdio: 'inherit',
        cwd: process.cwd(),
      })
    })

    it('should log command before execution', () => {
      execute('test command')

      expect(consoleLogSpy).toHaveBeenCalledWith(colors.green('test command'))
    })

    it('should handle command output logging', () => {
      const output = 'Command output\nLine 2'
      mockExecSync.mockReturnValue(Buffer.from(output))

      const result = execute('test command')

      expect(result).toBe(output)
      expect(consoleLogSpy).toHaveBeenCalledWith(colors.green('test command'))
      expect(consoleLogSpy).toHaveBeenCalledWith(output)
    })

    it('should trim output', () => {
      const output = '  output with spaces  \n'
      mockExecSync.mockReturnValue(Buffer.from(output))

      const result = execute('test')

      expect(result).toBe('output with spaces')
    })
  })

  describe('multiple commands execution', () => {
    it('should execute multiple commands in sequence', () => {
      mockExecSync
        .mockReturnValueOnce(Buffer.from('output1'))
        .mockReturnValueOnce(Buffer.from('output2'))
        .mockReturnValueOnce(Buffer.from('output3'))

      const result = execute(['cmd1', 'cmd2', 'cmd3'])

      expect(result).toBe(
        'output1\n-------------------------------\noutput2\n-------------------------------\noutput3',
      )
      expect(mockExecSync).toHaveBeenCalledTimes(3)
      expect(mockExecSync).toHaveBeenNthCalledWith(1, 'cmd1', expect.any(Object))
      expect(mockExecSync).toHaveBeenNthCalledWith(2, 'cmd2', expect.any(Object))
      expect(mockExecSync).toHaveBeenNthCalledWith(3, 'cmd3', expect.any(Object))
    })

    it('should handle empty commands array', () => {
      const result = execute([])

      expect(result).toBe('')
      expect(mockExecSync).not.toHaveBeenCalled()
    })

    it('should handle single command in array', () => {
      mockExecSync.mockReturnValue(Buffer.from('single output'))

      const result = execute(['single command'])

      expect(result).toBe('single output')
      expect(mockExecSync).toHaveBeenCalledTimes(1)
    })
  })

  describe('options handling', () => {
    it('should use custom working directory', () => {
      const customCwd = '/custom/path'

      execute('test', { cwd: customCwd })

      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'inherit',
        cwd: customCwd,
      })
    })

    it('should use current working directory by default', () => {
      execute('test')

      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'inherit',
        cwd: process.cwd(),
      })
    })

    it('should handle silent option', () => {
      mockExecSync.mockReturnValue(Buffer.from('silent output'))

      const result = execute('test', { silent: true })

      expect(result).toBe('silent output')
      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'pipe',
        cwd: process.cwd(),
      })
    })

    it('should handle fadedOutput option', () => {
      mockExecSync.mockReturnValue(Buffer.from('faded\noutput\nlines'))

      execute('test', { fadedOutput: true })

      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'pipe',
        cwd: process.cwd(),
      })
    })

    it('should handle noEcho option', () => {
      execute('test', { noEcho: true })

      // Should not log the command
      expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining(colors.green('test')))
    })

    it('should combine silent and fadedOutput options', () => {
      execute('test', { silent: true, fadedOutput: true })

      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'pipe',
        cwd: process.cwd(),
      })
    })
  })

  describe('output formatting', () => {
    it('should format faded output with dim colors and dashes', () => {
      const output = 'line1\nline2\nline3'
      mockExecSync.mockReturnValue(Buffer.from(output))

      execute('test', { fadedOutput: true })

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(colors.dim('- line1')))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(colors.dim('- line2')))
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(colors.dim('- line3')))
    })

    it('should filter empty lines in faded output', () => {
      const output = 'line1\n\nline2\n   \nline3'
      mockExecSync.mockReturnValue(Buffer.from(output))

      execute('test', { fadedOutput: true })

      // Should only log non-empty lines
      const logCalls = consoleLogSpy.mock.calls.map((call) => call[0])
      const outputCall = logCalls.find((call) => typeof call === 'string' && call.includes('- line1'))
      expect(outputCall).toBeDefined()
    })

    it('should handle output with carriage returns', () => {
      const output = 'line1\r\nline2\rline3'
      mockExecSync.mockReturnValue(Buffer.from(output))

      const result = execute('test')

      expect(result).toBe('line1\r\nline2\rline3')
    })

    it('should handle empty output', () => {
      mockExecSync.mockReturnValue(Buffer.from(''))

      const result = execute('test')

      expect(result).toBe('')
    })

    it('should handle null/undefined buffer output', () => {
      mockExecSync.mockReturnValue(null as any)

      const result = execute('test')

      expect(result).toBe('')
    })
  })

  describe('working directory display', () => {
    it('should show relative path when different from current directory', () => {
      const customCwd = '/custom/path'
      mockPath.relative.mockReturnValue('custom/path')
      mockPath.basename.mockReturnValue('path')

      execute('test', { cwd: customCwd })

      // Check that the first log call contains the expected content
      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
      // Account for ANSI color codes and check that it contains the basic format
      expect(consoleLogSpy.mock.calls[0][0]).toMatch(/test.*in/)
    })

    it('should not show path when same as current directory', () => {
      execute('test', { cwd: process.cwd() })

      expect(consoleLogSpy).toHaveBeenCalledWith(colors.green('test'))
    })

    it('should format relative path correctly', () => {
      const customCwd = '/some/deep/nested/path'
      mockPath.relative.mockReturnValue('some\\deep\\nested\\path')
      mockPath.basename.mockReturnValue('path')

      execute('test', { cwd: customCwd })

      expect(mockPath.relative).toHaveBeenCalledWith(process.cwd(), customCwd)
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('some/deep/nested/'))
    })
  })

  describe('stdio configuration', () => {
    it('should use inherit stdio by default', () => {
      execute('test')

      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'inherit',
        cwd: process.cwd(),
      })
    })

    it('should use pipe stdio when silent', () => {
      execute('test', { silent: true })

      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'pipe',
        cwd: process.cwd(),
      })
    })

    it('should use pipe stdio when fadedOutput', () => {
      execute('test', { fadedOutput: true })

      expect(mockExecSync).toHaveBeenCalledWith('test', {
        stdio: 'pipe',
        cwd: process.cwd(),
      })
    })
  })

  describe('error handling', () => {
    it('should propagate execSync errors', () => {
      const error = new Error('Command failed')
      mockExecSync.mockImplementation(() => {
        throw error
      })

      expect(() => execute('failing-command')).toThrow('Command failed')
    })

    it('should handle execSync returning non-buffer values', () => {
      mockExecSync.mockReturnValue('string output' as any)

      const result = execute('test')

      expect(result).toBe('string output')
    })

    it('should handle buffer without toString method', () => {
      const mockBuffer = { data: 'test' } as any
      mockExecSync.mockReturnValue(mockBuffer)

      const result = execute('test')

      expect(result).toBe('[object Object]') // Object.prototype.toString
    })
  })

  describe('edge cases', () => {
    it('should handle very long commands', () => {
      const longCommand = 'echo ' + 'a'.repeat(10000)

      execute(longCommand)

      expect(mockExecSync).toHaveBeenCalledWith(longCommand, expect.any(Object))
    })

    it('should handle commands with special characters', () => {
      const specialCommand = 'echo "Hello & World | Test > Output"'

      execute(specialCommand)

      expect(mockExecSync).toHaveBeenCalledWith(specialCommand, expect.any(Object))
    })

    it('should handle empty command string', () => {
      execute('')

      expect(mockExecSync).toHaveBeenCalledWith('', expect.any(Object))
    })

    it('should handle commands with unicode characters', () => {
      const unicodeCommand = 'echo "Hello 世界 🚀"'

      execute(unicodeCommand)

      expect(mockExecSync).toHaveBeenCalledWith(unicodeCommand, expect.any(Object))
    })

    it('should handle mixed array of empty and non-empty commands', () => {
      mockExecSync
        .mockReturnValueOnce(Buffer.from(''))
        .mockReturnValueOnce(Buffer.from('output'))
        .mockReturnValueOnce(Buffer.from(''))

      const result = execute(['', 'test', ''])

      expect(result).toBe('\n-------------------------------\noutput\n-------------------------------\n')
    })
  })

  describe('silent and fadedOutput interaction', () => {
    it('should not log output when both silent and fadedOutput are true', () => {
      mockExecSync.mockReturnValue(Buffer.from('should not be logged'))

      execute('test', { silent: true, fadedOutput: true })

      // Should not log the output
      expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('should not be logged'))
    })

    it('should log faded command when silent is true but fadedOutput is true', () => {
      execute('test', { silent: true, fadedOutput: true })

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(colors.dim(colors.green('test'))))
    })

    it('should respect noEcho even with fadedOutput', () => {
      execute('test', { noEcho: true, fadedOutput: true })

      expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('test'))
    })
  })
})
