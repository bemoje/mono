import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { spawn } from 'child_process'
import { shellSpawnProgram } from './shellSpawnProgram'

// Mock child_process
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}))

const mockSpawn = vi.mocked(spawn)

describe(shellSpawnProgram.name, () => {
  let mockChild: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockChild = {
      on: vi.fn(),
      stdout: { on: vi.fn() },
      stderr: { on: vi.fn() },
    }

    mockSpawn.mockReturnValue(mockChild)
  })

  it('examples', () => {
    expect(() => {
      // Basic program execution
      const result = shellSpawnProgram('node', '--version')
      assert(result instanceof Promise, 'should return promise')

      // Program with multiple arguments
      const resultWithArgs = shellSpawnProgram('npm', 'install', 'package-name')
      assert(resultWithArgs instanceof Promise, 'should handle multiple arguments')

      // Program with --no-inherit flag
      const resultNoInherit = shellSpawnProgram('git', 'status', '--no-inherit')
      assert(resultNoInherit instanceof Promise, 'should handle no-inherit flag')
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should spawn program with inherited stdio by default', async () => {
      const promise = shellSpawnProgram('node', '--version')

      // Simulate successful close
      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('node --version')
      expect(mockSpawn).toHaveBeenCalledWith('node', ['--version'], { stdio: 'inherit', shell: true })
    })

    it('should spawn program with multiple arguments', async () => {
      const promise = shellSpawnProgram('npm', 'install', 'express', '--save')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('npm install express --save')
      expect(mockSpawn).toHaveBeenCalledWith('npm', ['install', 'express', '--save'], {
        stdio: 'inherit',
        shell: true,
      })
    })

    it('should spawn program with no arguments', async () => {
      const promise = shellSpawnProgram('pwd')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('pwd ')
      expect(mockSpawn).toHaveBeenCalledWith('pwd', [], { stdio: 'inherit', shell: true })
    })
  })

  describe('--no-inherit flag handling', () => {
    it('should handle --no-inherit flag and spawn without stdio inherit', async () => {
      const promise = shellSpawnProgram('git', 'status', '--no-inherit')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('git status')
      expect(mockSpawn).toHaveBeenCalledWith('git', ['status'], { shell: true })
    })

    it('should handle --no-inherit flag at the beginning', async () => {
      const promise = shellSpawnProgram('ls', '--no-inherit', '-la')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('ls -la')
      expect(mockSpawn).toHaveBeenCalledWith('ls', ['-la'], { shell: true })
    })

    it('should handle --no-inherit flag in the middle', async () => {
      const promise = shellSpawnProgram('docker', 'run', '--no-inherit', '-it', 'ubuntu')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('docker run -it ubuntu')
      expect(mockSpawn).toHaveBeenCalledWith('docker', ['run', '-it', 'ubuntu'], { shell: true })
    })

    it('should handle multiple --no-inherit flags', async () => {
      const promise = shellSpawnProgram('test', '--no-inherit', 'arg1', '--no-inherit', 'arg2')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('test arg1 arg2 ')
      expect(mockSpawn).toHaveBeenCalledWith('test', ['arg1', 'arg2'], { shell: true })
    })

    it('should not affect arguments that contain --no-inherit as substring', async () => {
      const promise = shellSpawnProgram('program', '--config=--no-inherit-value')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('program --config=--no-inherit-value')
      expect(mockSpawn).toHaveBeenCalledWith('program', ['--config=--no-inherit-value'], {
        stdio: 'inherit',
        shell: true,
      })
    })
  })

  describe('error handling', () => {
    it('should reject when spawn emits error', async () => {
      const error = new Error('Program not found')
      const promise = shellSpawnProgram('nonexistent-program')

      // Simulate error
      const errorHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'error')[1]
      errorHandler(error)

      await expect(promise).rejects.toThrow('Program not found')
    })

    it('should handle spawn throwing synchronously', async () => {
      mockSpawn.mockImplementation(() => {
        throw new Error('Spawn failed')
      })

      await expect(shellSpawnProgram('failing-command')).rejects.toThrow()
    })
  })

  describe('shell integration', () => {
    it('should always use shell option', async () => {
      const promise = shellSpawnProgram('echo', 'hello world')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      await promise
      expect(mockSpawn).toHaveBeenCalledWith('echo', ['hello world'], { stdio: 'inherit', shell: true })
    })

    it('should handle shell-specific commands', async () => {
      const promise = shellSpawnProgram('ls', '-la', '|', 'grep', 'test')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('ls -la | grep test')
      expect(mockSpawn).toHaveBeenCalledWith('ls', ['-la', '|', 'grep', 'test'], { stdio: 'inherit', shell: true })
    })
  })

  describe('return value format', () => {
    it('should return command string with arguments', async () => {
      const promise = shellSpawnProgram('git', 'commit', '-m', 'test message')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('git commit -m test message')
    })

    it('should return just command when no arguments', async () => {
      const promise = shellSpawnProgram('pwd')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('pwd ')
    })

    it('should handle commands with special characters', async () => {
      const promise = shellSpawnProgram('echo', 'hello & world', '&&', 'echo', 'done')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('echo hello & world && echo done')
    })
  })

  describe('event listener setup', () => {
    it('should set up error and close event listeners', () => {
      void shellSpawnProgram('test-command')

      expect(mockChild.on).toHaveBeenCalledWith('error', expect.any(Function))
      expect(mockChild.on).toHaveBeenCalledWith('close', expect.any(Function))
    })

    it('should handle close event correctly', async () => {
      const promise = shellSpawnProgram('test-command', 'arg1')

      // Verify event listeners are set up
      const calls = mockChild.on.mock.calls
      const errorCall = calls.find((call: string[]) => call[0] === 'error')
      const closeCall = calls.find((call: string[]) => call[0] === 'close')

      expect(errorCall).toBeDefined()
      expect(closeCall).toBeDefined()

      // Simulate close
      const closeHandler = closeCall[1]
      closeHandler()

      const result = await promise
      expect(result).toBe('test-command arg1')
    })
  })

  describe('edge cases', () => {
    it('should handle empty command', async () => {
      const promise = shellSpawnProgram('')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe(' ')
      expect(mockSpawn).toHaveBeenCalledWith('', [], { stdio: 'inherit', shell: true })
    })

    it('should handle commands with only --no-inherit flag', async () => {
      const promise = shellSpawnProgram('command', '--no-inherit')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('command ')
      expect(mockSpawn).toHaveBeenCalledWith('command', [], { shell: true })
    })

    it('should handle arguments with spaces', async () => {
      const promise = shellSpawnProgram('echo', 'hello world', 'second arg')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe('echo hello world second arg')
    })

    it('should handle very long argument lists', async () => {
      const longArgs = Array.from({ length: 50 }, (_, i) => `arg${i}`)
      const promise = shellSpawnProgram('command', ...longArgs)

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(0)

      const result = await promise
      expect(result).toBe(`command ${longArgs.join(' ')}`)
    })

    it('should handle close with non-zero exit code', async () => {
      const promise = shellSpawnProgram('failing-command')

      const closeHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'close')[1]
      closeHandler(1) // Non-zero exit code

      // Should still resolve with command string
      const result = await promise
      expect(result).toBe('failing-command ')
    })
  })
})
