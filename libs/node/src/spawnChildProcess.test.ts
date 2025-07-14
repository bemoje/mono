import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { spawnChildProcess } from './spawnChildProcess'

const { mockSpawn } = vi.hoisted(() => {
  return {
    mockSpawn: vi.fn(),
  }
})

// Mock child_process
vi.mock('child_process', async () => {
  return {
    default: {
      spawn: mockSpawn,
    },
    spawn: mockSpawn,
  }
})

describe(spawnChildProcess.name, () => {
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
      // Basic child process spawn
      const result = spawnChildProcess('node')
      assert(result instanceof Promise, 'should return promise')

      // Child process with arguments
      const resultWithArgs = spawnChildProcess('node', ['--version'])
      assert(resultWithArgs instanceof Promise, 'should handle arguments')

      // Child process with spawn options
      const resultWithOptions = spawnChildProcess('node', [], { cwd: '/tmp' })
      assert(resultWithOptions instanceof Promise, 'should handle spawn options')

      // Child process with callback
      const resultWithCallback = spawnChildProcess('node', [], {}, (child) => {
        // Callback to access child process
      })
      assert(resultWithCallback instanceof Promise, 'should handle callback')
    }).not.toThrow()
  })

  describe('successful execution', () => {
    it('should spawn child process and resolve with exit code 0', async () => {
      const promise = spawnChildProcess('node', ['--version'])

      // Simulate successful exit
      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      const result = await promise
      expect(result).toBe(0)
      expect(mockSpawn).toHaveBeenCalledWith('node', ['--version'], {})
    })

    it('should handle spawn with custom options', async () => {
      const options = { cwd: '/custom/path', env: { NODE_ENV: 'test' } }
      const promise = spawnChildProcess('npm', ['test'], options)

      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      await promise
      expect(mockSpawn).toHaveBeenCalledWith('npm', ['test'], options)
    })

    it('should handle spawn with empty arguments', async () => {
      const promise = spawnChildProcess('node')

      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      await promise
      expect(mockSpawn).toHaveBeenCalledWith('node', [], {})
    })

    it('should handle spawn with undefined arguments', async () => {
      const promise = spawnChildProcess('node', undefined)

      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      await promise
      expect(mockSpawn).toHaveBeenCalledWith('node', [], {})
    })

    it('should handle spawn with empty spawn options', async () => {
      const promise = spawnChildProcess('node', ['--version'], {})

      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      await promise
      expect(mockSpawn).toHaveBeenCalledWith('node', ['--version'], {})
    })
  })

  describe('error handling', () => {
    it('should reject when child process has an error', async () => {
      const error = new Error('Spawn failed')
      const promise = spawnChildProcess('nonexistent-command')

      // Simulate error
      const errorHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'error')[1]
      errorHandler(error)

      await expect(promise).rejects.toThrow('Spawn failed')
    })

    it('should reject when child process exits with non-zero code', async () => {
      const promise = spawnChildProcess('node', ['failing-script.js'])

      // Simulate non-zero exit
      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(1, null)

      await expect(promise).rejects.toThrow(
        'Child node process exited with code: 1, signal: null, argv: [failing-script.js]',
      )
    })

    it('should reject when spawn throws synchronously', async () => {
      mockSpawn.mockImplementation(() => {
        throw new Error('Spawn threw synchronously')
      })

      await expect(spawnChildProcess('failing-command')).rejects.toThrow('Spawn threw synchronously')
    })

    it('should include arguments in error message', async () => {
      const args = ['script.js', '--arg1', 'value1', '--arg2', 'value2']
      const promise = spawnChildProcess('node', args)

      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(1, null)

      await expect(promise).rejects.toThrow(
        'Child node process exited with code: 1, signal: null, argv: [script.js, --arg1, value1, --arg2, value2]',
      )
    })
  })

  describe('callback functionality', () => {
    it('should call callback with child process', async () => {
      const callback = vi.fn()
      const promise = spawnChildProcess('node', ['--version'], {}, callback)

      expect(callback).toHaveBeenCalledWith(mockChild)

      // Complete the process
      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      await promise
    })

    it('should work without callback', async () => {
      const promise = spawnChildProcess('node', ['--version'])

      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      const result = await promise
      expect(result).toBe(0)
    })

    it('should call callback even if process fails', async () => {
      const callback = vi.fn()
      const promise = spawnChildProcess('failing-command', [], {}, callback)

      expect(callback).toHaveBeenCalledWith(mockChild)

      // Simulate failure
      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(1, null)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('event listener setup', () => {
    it('should set up error and exit event listeners', () => {
      void spawnChildProcess('node', ['--version'])

      expect(mockChild.on).toHaveBeenCalledWith('error', expect.any(Function))
      expect(mockChild.on).toHaveBeenCalledWith('exit', expect.any(Function))
    })

    it('should handle multiple event types correctly', async () => {
      const promise = spawnChildProcess('node', ['--version'])

      // Verify event listeners are set up
      const calls = mockChild.on.mock.calls
      const errorCall = calls.find((call: string[]) => call[0] === 'error')
      const exitCall = calls.find((call: string[]) => call[0] === 'exit')

      expect(errorCall).toBeDefined()
      expect(exitCall).toBeDefined()

      // Simulate successful exit
      const exitHandler = exitCall[1]
      exitHandler(0, null)

      const result = await promise
      expect(result).toBe(0)
    })
  })

  describe('argument handling', () => {
    it('should handle complex argument arrays', async () => {
      const complexArgs = [
        'script.js',
        '--option1',
        'value with spaces',
        '--flag',
        '--option2=value',
        'positional-arg',
      ]

      const promise = spawnChildProcess('node', complexArgs)
      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      await promise
      expect(mockSpawn).toHaveBeenCalledWith('node', complexArgs, {})
    })

    it('should handle complex spawn options', async () => {
      const complexOptions = {
        cwd: '/custom/working/directory',
        env: {
          NODE_ENV: 'production',
          DEBUG: 'app:*',
          PATH: '/custom/path',
        },
        stdio: 'pipe' as const,
        detached: true,
        shell: true,
      }

      const promise = spawnChildProcess('node', ['app.js'], complexOptions)
      const exitHandler = mockChild.on.mock.calls.find((call: string[]) => call[0] === 'exit')[1]
      exitHandler(0, null)

      await promise
      expect(mockSpawn).toHaveBeenCalledWith('node', ['app.js'], complexOptions)
    })
  })
})
